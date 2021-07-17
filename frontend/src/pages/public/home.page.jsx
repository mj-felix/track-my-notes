import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Container className='text-center col-sm-12 col-xl-6 offset-xl-3'>
            <h1 className="py-3">Track My Notes</h1>
            <p className="lead py-2">
                Do you create your notes in all sorts of places?
                Draft emails? Text files? Various apps on your computer?
            </p>
            <p className="lead py-2">
                Have you ever wanted to just store a link or a document?
                Or tag the notes your way and then easily find them?
            </p>
            <p className="lead py-2">
                Could your notes be of interest to others?
                What if you could make them public in a form of a blog?
            </p>
            <Row className="lead justify-content-center py-2">
                <Col sx={12} md={4}>
                    <Link to='/login'>
                        <Button variant="success" size="lg" className='w-100 my-1'>Login</Button>
                    </Link>
                </Col>
                <Col sx={12} md={4}>
                    <Link to='/register'>
                        <Button variant="info" size="lg" className='w-100 my-1'>Register</Button>
                    </Link>
                </Col>
            </Row>
        </Container>

    );
};

export default HomePage;