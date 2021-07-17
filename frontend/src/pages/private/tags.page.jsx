import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import AddTag from '../../components/tag/tag-add.component.jsx';
import TagList from '../../components/tag/tag-list.component.jsx';

const TagsPage = () => {
    return (
        <>
            <Row className='justify-content-sm-center'>
                <Col xs={12} sm={8} md={6}>
                    <h2 className='py-2'>Tags</h2>
                </Col>
            </Row>
            <Row className='justify-content-sm-center py-2'>
                <Col xs={12} sm={8} md={6}>
                    <Container>
                        <AddTag />
                    </Container>
                </Col>
            </Row>
            <Row className='justify-content-sm-center py-2'>
                <Col xs={12} sm={8} md={6}>
                    <TagList />
                </Col>
            </Row>
        </>
    );
};

export default TagsPage;;