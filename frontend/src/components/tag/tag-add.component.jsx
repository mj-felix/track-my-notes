import React, { useState, useContext } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

import AppContext from '../../context/app/app.context.js';
import FadeableAlert from '../misc/fadeable-alert.component.jsx';

const AddTag = ({ isNotePage }) => {
    const appContext = useContext(AppContext);
    const { addTag, note, updateNote, noteLoading } = appContext;

    const [tagName, setTagName] = useState('');
    const [error, setError] = useState(null);

    const addTagToNote = async (tagId) => {
        let newTags = note.tags.map(tag => tag._id);
        newTags.push(tagId);
        await updateNote(note._id, {
            ...note,
            tags: newTags
        });
    };

    const handleSubmit = async e => {
        if (tagName !== '') {
            e.preventDefault();
            const tagId = await addTag(tagName);
            if (tagId) {
                if (isNotePage) await addTagToNote(tagId);
                setTagName('');
                setError(null);
            } else {
                setError('Adding tag failed ... please try again.');
            }
        }
    };

    return (
        <>
            {error &&
                <FadeableAlert msg={error} variant='danger' cb={() => { setError(null); }} />
            }
            <Form onSubmit={handleSubmit}>
                <Row className='align-items-center no-gutters'>
                    <Col xs={9} md={isNotePage ? 12 : 9} lg={9}>
                        <Form.Control
                            type='text'
                            placeholder='Enter new tag name'
                            value={tagName}
                            required
                            onChange={(e) => setTagName(e.target.value.toLowerCase())}
                            className='my-2'
                            disabled={noteLoading}
                        />
                    </Col>
                    <Col xs={3} md={isNotePage ? 12 : 3} lg={3}>
                        <Button
                            type='submit'
                            variant='info'
                            className='w-100 my-2'
                            disabled={noteLoading}
                        >
                            {noteLoading ?
                                <>
                                    {!isNotePage && 'Add '}
                                    <Spinner animation="border" size='sm' variant='light' role="status" />
                                </>
                                :
                                <>Add</>
                            }
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

AddTag.propTypes = {
    isNotePage: PropTypes.bool,
};

export default AddTag;