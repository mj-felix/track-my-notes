import React, { useContext, useState, useEffect } from "react";
import { Button, Form, Row, Col, Spinner, Card } from "react-bootstrap";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router";

import AppContext from "../../context/app/app.context.js";

const SearchNotes = ({ history, location }) => {
  const appContext = useContext(AppContext);
  const { tags, loading } = appContext;

  const searchCriteria = queryString.parse(location.search);
  if (searchCriteria.tags) {
    searchCriteria.tags = searchCriteria.tags.split(",");
  } else {
    searchCriteria.tags = [];
  }
  if (!searchCriteria.search) {
    searchCriteria.search = "";
  }

  const [keyword, setKeyword] = useState(searchCriteria.search);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  const handleClick = (tagId, eraseKeyword) => {
    if (eraseKeyword && !searchCriteria.search) {
      setKeyword("");
      return;
    }
    if (tagId) {
      if (searchCriteria.tags && searchCriteria.tags.includes(tagId)) {
        searchCriteria.tags = searchCriteria.tags.filter(
          (tag) => tag !== tagId
        );
      } else {
        searchCriteria.tags.push(tagId);
      }
    }
    history.push(
      `/notes?tags=${searchCriteria.tags.join()}&search=${
        eraseKeyword ? "" : keyword
      }`
    );
  };

  useEffect(() => {
    if (!queryString.parse(location.search).search) {
      setKeyword("");
    }
  }, [location]);

  return (
    <Card>
      <Card.Header>Search Notes</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="mb-3">
          <Row className="align-items-center no-gutters">
            <Col xs={9} className="d-flex align-items-center">
              {keyword.length > 0 && (
                <FontAwesomeIcon
                  icon={faTimes}
                  className="me-2 pointer"
                  onClick={() => handleClick(null, true)}
                />
              )}
              <Form.Control
                type="text"
                placeholder="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value.toLowerCase())}
                className="my-2"
                disabled={loading}
              />
            </Col>
            <Col xs={3}>
              <Button
                type="submit"
                variant="info"
                className="w-100 my-2"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    variant="light"
                    role="status"
                  />
                ) : (
                  <FontAwesomeIcon icon={faSearch} />
                )}
              </Button>
            </Col>
          </Row>
        </Form>

        {tags.map((tag) => {
          const isTagSelected = searchCriteria.tags
            ? searchCriteria.tags.includes(tag._id)
            : false;
          return (
            <Button
              key={tag._id}
              variant={isTagSelected ? "primary" : "secondary"}
              className="me-1 mb-1"
              size="sm"
              disabled={loading}
              onClick={(e) => {
                handleClick(tag._id);
                e.target.blur();
              }}
            >
              {tag.name}
            </Button>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default withRouter(SearchNotes);
