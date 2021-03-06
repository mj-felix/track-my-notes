import React from "react";
import { Badge, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import TooltipPopup from "../misc/tooltip-popup.component.jsx";

import { generateColor } from "../../utils/misc.utils";

const NoteTile = ({ note }) => {
  let color = 0;

  return (
    <Card style={{ maxHeight: "500px" }} className="mb-3">
      <Card.Header
        as="h6"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="me-1">
          <Link to={`/note/${note._id}`} className="tile-title">
            {note.title.length > 33
              ? note.title.substring(0, 30) + "..."
              : note.title}
          </Link>
        </div>
        <div className="d-flex flex-nowrap">
          {note.files.length > 0 && (
            <TooltipPopup msg="Note has attachments" placement="left">
              <Badge bg="info">
                <FontAwesomeIcon size="sm" icon={faPaperclip} />
              </Badge>
            </TooltipPopup>
          )}
          {note.isPublic && (
            <TooltipPopup msg="Note is public" placement="top">
              <Badge bg="success">
                <a href={`/user/${note.user.profileName}/notes/${note._id}`}>
                  P
                </a>
              </Badge>
            </TooltipPopup>
          )}
          {note.isSticky && (
            <TooltipPopup msg="Note is shown first" placement="bottom">
              <Badge bg="warning" className="text-dark">
                S
              </Badge>
            </TooltipPopup>
          )}
          {note.link && (
            <TooltipPopup msg="Note has a link" placement="top">
              <Badge bg="primary">
                <a href={note.link} target="_blank" rel="noreferrer">
                  <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
                </a>
              </Badge>
            </TooltipPopup>
          )}
        </div>
      </Card.Header>

      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Text>
          {note.description && note.description.length > 300
            ? note.description.substring(0, 297) + "..."
            : note.description}
        </Card.Text>
        <Card.Text>
          {note.tags.length > 0 &&
            note.tags.map((tag) => (
              <Badge
                key={tag._id}
                bg={generateColor(color++)}
                className="me-1 mb-1"
              >
                <Link to={`/notes?tags=${tag._id}`}>{tag.name}</Link>
              </Badge>
            ))}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

NoteTile.propTypes = {
  note: PropTypes.object.isRequired,
};

export default NoteTile;
