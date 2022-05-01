import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import AuthContext from "../../context/auth/auth.context.js";
import FadeableAlert from "../../components/misc/fadeable-alert.component.jsx";
import TooltipPopup from "../../components/misc/tooltip-popup.component.jsx";

const RegisterPage = () => {
  const authContext = useContext(AuthContext);
  const { register, loading, error, eraseError } = authContext;

  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    register({
      profileName,
      email,
      password,
      repeatPassword,
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
          <h2 className="pt-2">Register</h2>
          {error && (
            <FadeableAlert
              msg={error.message}
              variant="danger"
              cb={eraseError}
            />
          )}
          <Form onSubmit={handleSubmit} className="py-2">
            <Row>
              <Form.Group controlId="profileName">
                <Form.Label>
                  Profile Name{" "}
                  <TooltipPopup
                    msg="Profile name is used for your public content."
                    placement="right"
                  >
                    <span>
                      <FontAwesomeIcon size="sm" icon={faInfoCircle} />
                    </span>
                  </TooltipPopup>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter profile name"
                  value={profileName}
                  required
                  onChange={(e) => setProfileName(e.target.value.toLowerCase())}
                />
              </Form.Group>
            </Row>
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
            <Row>
              <Form.Group controlId="repeatePassword">
                <Form.Label>Repeat Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password again"
                  value={repeatPassword}
                  required
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Button
              type="submit"
              variant="info"
              className="w-100 my-2"
              disabled={loading}
            >
              Register{" "}
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

export default RegisterPage;
