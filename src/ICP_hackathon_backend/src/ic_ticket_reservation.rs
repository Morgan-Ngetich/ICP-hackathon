// External dependency for QR code generation
use qrcode::QrCode;
use qrcode::render::svg;
use ic_cdk_macros::*;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::storage::stable_save;
use ic_cdk::Principal;
use std::collections::BTreeMap;
use std::sync::{Arc, Mutex};
use std::thread;
use firebase_admin::{credentials::Credentials, error::FirebaseError, initialize, storage::FirebaseStorage};
use lazy_static::lazy_static;

// Hardcoded list of allowed principals (users)
const ALLOWED_PRINCIPALS: [&str; 3] = [
    "principal1",
    "principal2",
    "principal3",
];

#[derive(CandidType, Deserialize)]
struct Ticket {
    id: u32,
    event_name: String,
    price: u32,
    available_quantity: u32,
    qr_code: String,
}

#[derive(CandidType, Deserialize)]
struct Reservation {
    quantity: u32,
    user: ic_cdk::Principal,
}

#[derive(CandidType, Deserialize)]
struct State {
    tickets: Vec<Ticket>,
    reservations: Vec<Reservation>,
    next_ticket_id: u32,
}

#[init]
fn init() -> State {
    State {
        tickets: Vec::new(),
        reservations: Vec::new(),
        next_ticket_id: 0,
    }
}

// Function to generate QR code for a ticket
fn generate_qr_code(ticket_id: u32) -> Result<String, qrcode::types::QrError> {
    let code = QrCode::new(format!("Ticket ID: {}", ticket_id))?;
    let image = code.render::<svg::Color>().build();
    Ok(image.to_string())
}

lazy_static! {
    static ref STORAGE: Arc<Mutex<Option<FirebaseStorage>>> = Arc::new(Mutex::new(None));
}

fn initialize_firebase() -> Result<(), FirebaseError> {
    let credentials = Credentials::from_values(
      Some("AIzaSyBUQ7BVNtWskvh7XiPLNTineh9d_scMssE"),
      Some("744462707174"),
      Some("icp-imagestorage.firebaseapp.com"),
      Some("icp-imagestorage"),
      Some("AIzaSyBUQ7BVNtWskvh7XiPLNTineh9d_scMssE"),
      None,
    );

    initialize(credentials)?;
    initialize_storage()?;
    Ok(())
}

fn initialize_storage() -> Result<(), FirebaseError> {
    let storage = FirebaseStorage::new()?;
    *STORAGE.lock().unwrap() = Some(storage);
    Ok(())
}

#[update]
fn add_ticket(event_name: String, price: u32, available_quantity: u32) {
    let ticket_id = state.next_ticket_id;
    let qr_code = match generate_qr_code(ticket_id) {
        Ok(code) => code,
        Err(err) => {
            ic_cdk::trap(&format!("Failed to generate QR code: {}", err));
            return;
        }
    };

    // Move the QR code generation to a separate thread
    thread::spawn(move || {
        let _qr_code = generate_qr_code(ticket_id);
        // Optionally, store the QR code in a database or other storage
    });

    let ticket = Ticket {
        id: ticket_id,
        event_name: event_name.clone(),
        price,
        available_quantity,
        qr_code,
    };
    state.tickets.push(ticket);
    state.next_ticket_id += 1;
}

#[update]
fn reserve_ticket(ticket_id: u32, quantity: u32) {
    let caller = ic_cdk::caller();

    if let Some(ticket) = state.tickets.get_mut(ticket_id as usize) {
        if ticket.available_quantity >= quantity {
            let reservation = Reservation {
                quantity,
                user: ic_cdk::caller(),
            };
            state.reservations.push(reservation);
            ticket.available_quantity -= quantity;
        } else {
            ic_cdk::trap("Insufficient ticket quantity");
        }
    } else {
        ic_cdk::trap("Invalid ticket ID");
    }
}

#[query]
fn get_ticket(ticket_id: u32) -> Ticket {
    let ticket = state.tickets.get(ticket_id as usize);
    match ticket {
        Some(ticket) => ticket.clone(),
        None => panic!("Ticket not found"),
    }
}

struct Event {
    id: u32,
    name: String,
    date: String,
    location: String,
    image_url: String,
    ticket_types: Vec<TicketType>,
}

struct TicketType {
    name: String,
    price: u32,
    quantity: u32,
}

#[update]
fn add_event(name: String, date: String, location: String, image: Vec<u8>, ticket_types: Vec<TicketType>) {
    let event_id = state.events.len() as u32;
    let image_url = upload_image_to_firebase_storage(&image, event_id).unwrap_or_else(|err| {
        ic_cdk::trap(&format!("Failed to upload image: {}", err));
    });

    let event = Event {
        id: event_id,
        name,
        date,
        location,
        image_url,
        ticket_types,
    };
    state.events.push(event);
}

#[update]
fn update_event(event_id: u32, name: String, date: String, location: String, image: Vec<u8>, ticket_types: Vec<TicketType>) {
    match state.events.iter_mut().find(|event| event.id == event_id) {
        Some(event) => {
            event.name = name;
            event.date = date;
            event.location = location;
            event.image_url = upload_image_to_firebase_storage(&image, event_id).unwrap_or_else(|err| {
                ic_cdk::trap(&format!("Failed to upload image: {}", err));
            });
            event.ticket_types = ticket_types;
        }
        None => ic_cdk::trap("Event not found"),
    }
}

fn upload_image_to_firebase_storage(image: &[u8], event_id: u32) -> Result<String, FirebaseError> {
    let storage_arc = Arc::clone(&STORAGE);

    thread::spawn(move || {
        let mut storage = storage_arc.lock().unwrap();
        let storage = storage.as_mut().unwrap();

        let bucket_name = "your_bucket_name";
        let file_name = format!("images/event_{}.jpg", event_id);

        let file = storage.bucket(bucket_name)?.file(&file_name);
        file.upload_from_memory(image)?;

        let public_url = file.public_url().to_string();
        println!("Image uploaded successfully. Public URL: {}", public_url);
    });

    Ok("".to_string())
}

#[derive(Default)]
struct FeedbackState {
    feedbacks: BTreeMap<u64, Feedback>,
}

#[derive(Clone, CandidType, Deserialize)]
struct Feedback {
    event_id: u32,
    rating: u32,
    comment: String,
}

fn get_state() -> FeedbackState {
    FeedbackState::default()
}

#[update]
fn submit_feedback(feedback: Feedback) {
    let caller = ic_cdk::caller();

    if !is_authenticated(&caller) {
        ic_cdk::trap("User is not authenticated");
    }

    let mut state = get_state();
    state.feedbacks.insert(feedback.event_id as u64, feedback.clone());
    set_state(state);
}

fn is_authenticated(caller: &Principal) -> bool {
    let caller_str = caller.to_string();
    ALLOWED_PRINCIPALS.iter().any(|&p| p == caller_str)
}

fn set_state(state: FeedbackState) {
    let bytes = serde_cbor::to_vec(&state).expect("Failed to serialize state");
    stable_save("state", &bytes).expect("Failed to save state");
}

fn main() {
    let payment_gateway_result = integrate_with_payment_gateway(123, 100, "Credit Card".to_string());
    match payment_gateway_result {
        Ok(message) => println!("Payment Gateway Integration: {}", message),
        Err(err) => println!("Payment Gateway Integration Error: {}", err),
    }

    let event_calendar_result = integrate_with_event_calendar(456, 1620777600, 1620864000);
    match event_calendar_result {
        Ok(message) => println!("Event Calendar Integration: {}", message),
        Err(err) => println!("Event Calendar Integration Error: {}", err),
    }

    let ticket_scanner_result = integrate_with_ticket_scanner(789);
    match ticket_scanner_result {
        Ok(message) => println!("Ticket Scanner Integration: {}", message),
        Err(err) => println!("Ticket Scanner Integration Error: {}", err),
    }
}

fn integrate_with_payment_gateway(order_id: u32, amount: u32, payment_method: String) -> Result<String, String> {
    Ok(format!("Payment of {} accepted for order {}", amount, order_id))
}

fn integrate_with_event_calendar(event_id: u32, start_date: u64, end_date: u64) -> Result<String, String> {
    Ok(format!("Event {} scheduled from {} to {}", event_id, start_date, end_date))
}

fn integrate_with_ticket_scanner(ticket_id: u32) -> Result<String, String> {
    Ok(format!("Ticket {} scanned successfully", ticket_id))
}

struct SeatingMap {
    venue_id: u32,
    rows: u32,
    cols: u32,
    seats: Vec<Vec<Seat>>,
}

struct Seat {
    row: u32,
    col: u32,
    is_reserved: bool,
}

fn display_seating_map(venue_id: u32) {
    // Display seating map logic
}

fn reserve_seat(venue_id: u32, row: u32, col: u32) {
    // Reserve seat logic
}
