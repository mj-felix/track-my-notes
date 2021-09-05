import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className='fixed-bottom bg-light d-none d-md-block'>
            <Container className='col-sm-12 col-xl-10 offset-xl-1'>
                <Row className='align-items-center justify-content-between'>
                    <Col className='d-flex'>
                        <span className='mr-1'>&copy;</span>
                        <span>2021 TrackMyNotes by&nbsp;<a href='https://mjfelix.dev' target='_blank' rel='noreferrer'>MJ&nbsp;Felix</a></span>
                    </Col>
                    <Col className='text-right col-4'>
                        <a href='https://www.buymeacoffee.com/mjfelix' className='mr-1 
                        
                        btn btn-sm btn-secondary' target='_blank' rel='noreferrer'>
                            Shout me a&nbsp;&#127866;
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer >
    );
};

export default Footer;