import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";

import AuthContext from "../../context/auth/auth.context.js";
import FadeableAlert from "../../components/misc/fadeable-alert.component.jsx";

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const { login, loading, error, eraseError } = authContext;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      email,
      password,
    });
  };

  useEffect(() => {
    return () => eraseError();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="py-2">Login</h2>
          {error && (
            <FadeableAlert
              msg={error.message}
              variant="danger"
              cb={eraseError}
            />
          )}
          <Form onSubmit={handleSubmit} className="pt-2">
            <Row>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Button
              type="submit"
              variant="success"
              className="w-100 my-2"
              disabled={loading}
            >
              Login{" "}
              {loading && (
                <Spinner
                  animation="border"
                  size="sm"
                  variant="light"
                  role="status"
                />
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
