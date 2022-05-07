import React, { Fragment, useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container } from "react-bootstrap";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faStickyNote,
  faTag,
  faUserCircle,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";

import RefreshTokenStatus from "../misc/refresh-token-status.component.jsx";

import AuthContext from "../../context/auth/auth.context.js";

const Header = ({ location }) => {
  const authContext = useContext(AuthContext);
  const { refreshToken } = authContext;

  const privateLinks = (
    <Fragment>
      <LinkContainer to="/note/new">
        <Nav.Link>
          <FontAwesomeIcon size="lg" icon={faPlusCircle} className="me-2" />
          <span className="d-sm-none font-weight-bolder">Add a note</span>
        </Nav.Link>
      </LinkContainer>
      <LinkContainer to="/notes">
        <Nav.Link>
          <FontAwesomeIcon
            size="lg"
            icon={faStickyNote}
            style={{ width: "20" }}
            className="me-2"
          />
          <span className="d-sm-none font-weight-bolder">Notes</span>
        </Nav.Link>
      </LinkContainer>
      <LinkContainer to="/tags">
        <Nav.Link>
          <FontAwesomeIcon size="lg" icon={faTag} className="me-2" />
          <span className="d-sm-none font-weight-bolder">Tags</span>
        </Nav.Link>
      </LinkContainer>
      <LinkContainer to="/profile">
        <Nav.Link>
          <FontAwesomeIcon size="lg" icon={faUserCircle} className="me-2" />
          <span className="d-sm-none font-weight-bolder">Profile</span>
        </Nav.Link>
      </LinkContainer>
      <LinkContainer to="/logout">
        <Nav.Link>
          <FontAwesomeIcon size="lg" icon={faPowerOff} className="me-2" />
          <span className="d-sm-none font-weight-bolder">Logout</span>
        </Nav.Link>
      </LinkContainer>
    </Fragment>
  );

  const publicLinks = (
    <Fragment>
      <LinkContainer to="/login">
        <Nav.Link>Login</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/register">
        <Nav.Link>Register</Nav.Link>
      </LinkContainer>
    </Fragment>
  );

  return (
    <header>
      <Navbar
        variant="dark"
        bg="dark"
        expand="sm"
        className="py-1 px-sm-0"
        fixed="top"
        collapseOnSelect
      >
        <Container fluid="xxl">
          <div className="d-inline-flex align-items-center">
            <RefreshTokenStatus />
            <LinkContainer to={refreshToken ? "/notes" : "/"}>
              <Navbar.Brand>
                TrackMyNotes
                <sup className="text-muted font-weight-light">BETA</sup>
              </Navbar.Brand>
            </LinkContainer>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" activeKey={location.pathname}>
              {refreshToken ? privateLinks : publicLinks}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default withRouter(Header);
