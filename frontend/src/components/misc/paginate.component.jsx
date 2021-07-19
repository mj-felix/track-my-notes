import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import queryString from 'query-string';

const Paginate = ({ pages, page, location, profileName }) => {
    const searchCriteria = queryString.parse(location.search);
    let strSearchCriteria = '';
    if (searchCriteria.tags) {
        strSearchCriteria += `&tags=${searchCriteria.tags}`;
    }
    if (searchCriteria.search) {
        strSearchCriteria += `&search=${searchCriteria.search}`;
    }
    const url = profileName ? `/user/${profileName}` : '';
    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                        key={x + 1}
                        to={`${url}/notes?page=${x + 1}${strSearchCriteria}`}
                    >
                        <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                    </LinkContainer >
                ))}
            </Pagination >
        )
    );
};

export default Paginate;