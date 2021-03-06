import React, { useContext } from "react";
import { Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import dateFormat from "dateformat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import AppContext from "../../context/app/app.context.js";
import {
  removeProtocol,
  amendLinks,
  replaceStringWithMapping,
  convertMarkdownToHtmlSafely,
} from "../../utils/manipulate-string.utils.js";
import { generateMappingFromFiles } from "../../utils/misc.utils";

const Note = ({ setIsBeingUpdated, history, handleDelete, deleteLoading }) => {
  const appContext = useContext(AppContext);
  const { note, noteLoading } = appContext;

  return (
    <Row>
      <Col xs={12}>
        <h2>{note.title}</h2>
        <div className="h4">
          {note.isPublic && (
            <Badge bg="success">
              <a href={`/user/${note.user.profileName}/notes/${note._id}`}>
                Public
                {note.madePublicAt && (
                  <>
                    {" "}
                    since{" "}
                    <time
                      dateTime={dateFormat(note.madePublicAt, "yyyy-mm-dd")}
                    >
                      {dateFormat(note.madePublicAt, "dd mmm yyyy")}
                    </time>
                  </>
                )}
                <FontAwesomeIcon icon={faLink} size="sm" className="ms-1" />
              </a>
            </Badge>
          )}
          {note.isSticky && (
            <Badge bg="warning" className="text-dark">
              Sticky
            </Badge>
          )}
          {note.link && (
            <Badge bg="primary">
              <a href={note.link} target="_blank" rel="noreferrer">
                {removeProtocol(note.link).length > 40
                  ? removeProtocol(note.link).substring(0, 37) + "..."
                  : removeProtocol(note.link)}
                <FontAwesomeIcon
                  size="sm"
                  icon={faExternalLinkAlt}
                  className="ms-1"
                />
              </a>
            </Badge>
          )}
        </div>
        {note.description && (
          <div
            onClick={() => {
              setIsBeingUpdated(true);
            }}
            dangerouslySetInnerHTML={{
              __html: replaceStringWithMapping(
                amendLinks(convertMarkdownToHtmlSafely(note.description)),
                generateMappingFromFiles(note.files)
              ),
            }}
            className="mt-4 px-2 py-2 px-md-3 py-md-3 px-lg-4 py-lg-4 bg-white note border text-break"
          />
        )}
        <Row className="">
          <Col xs={4}>
            <Button
              bg="success"
              className="w-100 mb-3 mt-4"
              disabled={noteLoading}
              onClick={() => history.goBack()}
            >
              Go Back
            </Button>
          </Col>
          <Col xs={4}>
            <Button
              variant="danger"
              className="w-100 mb-3 mt-4"
              disabled={noteLoading}
              onClick={handleDelete}
            >
              Delete{" "}
              {deleteLoading && (
                <Spinner
                  animation="border"
                  size="sm"
                  variant="light"
                  role="status"
                />
              )}
            </Button>
          </Col>
          <Col xs={4}>
            <Button
              variant="info"
              className="w-100 mb-3 mt-4"
              disabled={noteLoading}
              onClick={() => {
                setIsBeingUpdated(true);
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

Note.propTypes = {
  setIsBeingUpdated: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  deleteLoading: PropTypes.bool.isRequired,
};

export default withRouter(Note);
