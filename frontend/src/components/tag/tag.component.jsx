import React from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-regular-svg-icons";

const Tag = ({ tag, handleDelete, isBeingDeleted, setTagToBeUpdated }) => {
  return (
    <tr>
      <td className="font-weight-bolder ps-4">
        <Link to={`/notes?tags=${tag._id}`}>{tag.name}</Link>
      </td>
      <td className="text-end pe-4">
        {isBeingDeleted ? (
          <Spinner animation="border" size="sm" variant="dark" role="status" />
        ) : (
          <>
            <FontAwesomeIcon
              size="lg"
              icon={faEdit}
              className="me-4 pointer"
              onClick={() => {
                setTagToBeUpdated(tag);
              }}
            />
            <FontAwesomeIcon
              size="lg"
              icon={faTrashAlt}
              className="pointer"
              onClick={() => {
                handleDelete(tag);
              }}
            />
          </>
        )}
      </td>
    </tr>
  );
};

Tag.propTypes = {
  tag: PropTypes.object.isRequired,
  handleDelete: PropTypes.func,
  setTagToBeUpdated: PropTypes.func,
  isBeingDeleted: PropTypes.bool,
};

export default Tag;
