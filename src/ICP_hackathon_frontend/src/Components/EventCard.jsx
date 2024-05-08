import React, {useState} from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const eventData = [
    {
        eventName: 'Harmony',
        date: 'January 1, 2025',
        time: '10:00 AM - 5:00 PM',
        location: 'Event Venue',
        image: 'https://via.placeholder.com/150'
    },
    {
        eventName: 'Festival of Colors',
        date: 'February 15, 2025',
        time: '12:00 PM - 8:00 PM',
        location: 'City Park',
        image: 'https://via.placeholder.com/150'
    },
    {
        eventName: 'Tech Summit',
        date: 'March 10, 2025',
        time: '9:00 AM - 6:00 PM',
        location: 'Convention Center',
        image: 'https://via.placeholder.com/150'
    },
    {
      eventName: 'Tech Summit',
      date: 'March 10, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'Convention Center',
      image: 'https://via.placeholder.com/150'
  },
  {
    eventName: 'Tech Summit',
    date: 'March 10, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Convention Center',
    image: 'https://via.placeholder.com/150'
},
{
  eventName: 'Tech Summit',
  date: 'March 10, 2025',
  time: '9:00 AM - 6:00 PM',
  location: 'Convention Center',
  image: 'https://via.placeholder.com/150'
}
  
];
const EventCard = ({ event }) => {
    const [countdown, setCountdown] = useState(false);

    const handleMouseEnter = () => {
        setCountdown(true);
    };

    const handleMouseLeave = () => {
        setCountdown(false);
    };

    return (
      <Col sm={12} md={6} lg={4}>
        <Card
            style={{
                width: '18rem',
                border: '1px solid black',
                boxShadow: '2px 2px 2px black',
                borderRadius: '5px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'white',
                margin: '20px'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Card.Img variant="top" src={event.image} style={{ width: '100%' }} />
            <Card.Body>
                <Card.Title style={{ color: '#333', fontSize: '1.7rem', marginBottom: '10px', textAlign: 'center' }}>
                    {event.eventName}
                </Card.Title>
                <Card.Text style={{ color: '#333', marginBottom: '15px', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    <span style={{ display: 'block', marginTop: '8px' }}>
                        <strong><FaCalendar />:</strong> {event.date}<br />
                        <strong><FaClock />:</strong> {event.time}<br />
                        <strong><FaMapMarkerAlt />:</strong> {event.location}
                    </span>
                </Card.Text>

                <Button style={{ padding: '10px', borderRadius: '10px', border: 0 }} variant="primary">View Details</Button>
                {countdown && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            backgroundColor: '#f57c00',
                            color: '#fff',
                            padding: '5px',
                            textAlign: 'center',
                        }}
                    >
                        Event starts in 5 days
                    </div>
                )}
            </Card.Body>
        </Card>
      </Col>
    );
};

const EventList = () => {
  return (

      <Row>
        <div style={{textAlign: 'center'}}>
        <span className="quote-mark" style={{fontSize: '4rem'}}>"</span>
          Explore more <span style={{color: 'orange', fontSize: '2.5rem'}}>Events</span>
        <span className="quote-mark" style={{fontSize: '4rem'}}>"</span>
        </div>
          {eventData.map((event, index) => (
              <EventCard key={index} event={event} />
          ))}

          <div style={{display: 'center', justifyContent: 'center'}}>
            <Button style={{fontSize: '2rem', backgroundColor:'orange', boxShadow: '2px 2px 2px black', border: 0}}>Explore more</Button>
          </div>
      </Row>
  );
};

export default EventList;
