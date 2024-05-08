import React from 'react';
import { Form, Button } from 'react-bootstrap';

const EventRegistrationForm = () => {
    return (
        <Form>
            <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>

            <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>

            <Form.Group controlId="formPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Enter your phone number" />
            </Form.Group>

            <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Enter your address" />
            </Form.Group>

            <Form.Group controlId="formOrganization">
                <Form.Label>Organization/Company</Form.Label>
                <Form.Control type="text" placeholder="Enter your organization/company" />
            </Form.Group>

            <Form.Group controlId="formJobTitle">
                <Form.Label>Job Title/Role</Form.Label>
                <Form.Control as="select" defaultValue="">
                    <option value="">Select your job title</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Marketing Specialist">Marketing Specialist</option>
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="Accountant">Accountant</option>
                    <option value="HR Manager">HR Manager</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formEventQuestions">
                <Form.Label>Event-specific Questions</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter any specific questions or requirements" />
            </Form.Group>

            <Form.Group controlId="formPaymentInfo">
                <Form.Label>Payment Information</Form.Label>
                <Form.Control type="text" placeholder="Enter your payment information" />
            </Form.Group>

            <Form.Group controlId="formTermsConditions">
                <Form.Check type="checkbox" label="I agree to the terms and conditions" />
            </Form.Group>

            <Button variant="warning" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default EventRegistrationForm;
