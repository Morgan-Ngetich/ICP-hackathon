import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import EventRegistrationForm from './EventRegistrationForm'
function EventDetailsPage() {
    const [showModal, setShowModal] = useState(false);

    const handleRegisterClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <h1>Event Details</h1>
            <p>Event description goes here...</p>
            <Button onClick={handleRegisterClick}>Register</Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Registration Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EventRegistrationForm />                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary">Register</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EventDetailsPage;
