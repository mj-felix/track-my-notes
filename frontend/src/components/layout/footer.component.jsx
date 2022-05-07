import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="fixed-bottom bg-light d-none d-md-block">
      <Container fluid="xxl">
        <Row>
          <Col>
            <span className="me-1">&copy;</span>
            <span>
              2021 TrackMyNotes by&nbsp;
              <a href="https://mjfelix.dev" target="_blank" rel="noreferrer">
                MJ&nbsp;Felix
              </a>
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
