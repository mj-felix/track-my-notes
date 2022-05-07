import React from "react";
import { Badge, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import sanitizeHtml from "sanitize-html";
import { withRouter } from "react-router";

import TooltipPopup from "../misc/tooltip-popup.component.jsx";

import { removeProtocol } from "../../utils/manipulate-string.utils.js";
import { generateColor } from "../../utils/generate-color.utils";

const PublicNote = ({ note, match, isTile }) => {
  const sanitizedNoteDescription = sanitizeHtml(note.description, {
    allowedTags: [],
    allowedAttributes: {},
  });

  let color = 0;

  const tags = (
    <Card.Text>
      {note.tags.length > 0 &&
        note.tags.map((tag) => (
          <Badge
            key={tag._id}
            bg={generateColor(color++)}
            className="me-1 mb-1"
          >
            <Link
              to={`/user/${match.params.profileName}/notes?tags=${tag._id}`}
            >
              {tag.name}
            </Link>
          </Badge>
        ))}
    </Card.Text>
  );

  return (
    <Card className="mb-3">
      <Card.Header
        as="h5"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="me-1">
          {isTile ? (
            <Link to={`/user/${match.params.profileName}/notes/${note._id}`}>
              {note.title}
            </Link>
          ) : (
            <span>{note.title}</span>
          )}
        </div>
        <div className="text-end">
          {note.isSticky && isTile && (
            <TooltipPopup msg="Note is shown at the top." placement="left">
              <Badge bg="warning" className="text-dark">
                Sticky
              </Badge>
            </TooltipPopup>
          )}
          {note.madePublicAt && (
            <TooltipPopup msg="Publication Date" placement="top">
              <Badge bg="success">
                <time dateTime={dateFormat(note.madePublicAt, "yyyy-mm-dd")}>
                  {dateFormat(note.madePublicAt, "dd mmm yyyy")}
                </time>
              </Badge>
            </TooltipPopup>
          )}
          {note.files.length > 0 && (
            <TooltipPopup msg="Note has attachments." placement="bottom">
              <Badge bg="info">
                <FontAwesomeIcon size="sm" icon={faPaperclip} />
              </Badge>
            </TooltipPopup>
          )}
          {note.link && (
            <Badge bg="primary">
              <a href={note.link} target="_blank" rel="noreferrer">
                <span className="d-none d-sm-inline-block me-1">
                  {removeProtocol(note.link).length > 40
                    ? removeProtocol(note.link).substring(0, 37) + "..."
                    : removeProtocol(note.link)}
                </span>
                <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
              </a>
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Body className="d-flex flex-column justify-content-between">
        {tags}
        {isTile ? (
          <Card.Text className="font-italic">
            {sanitizedNoteDescription && sanitizedNoteDescription.length > 400
              ? sanitizedNoteDescription.substring(0, 397) + "..."
              : sanitizedNoteDescription}
          </Card.Text>
        ) : (
          <>
            {note.description && (
              <div
                dangerouslySetInnerHTML={{ __html: note.description }}
                className="note"
              />
            )}
            {note.files.length > 0 && (
              <>
                <h4>Attachments</h4>
                <ul className="list-unstyled">
                  {note.files.map((file) => (
                    <li key={file._id}>
                      <a href={file.url} target="_blank" rel="noreferrer">
                        {file.originalFileName} (
                        {(file.size / 1024 / 1024).toFixed(2)} MB)
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default withRouter(PublicNote);
