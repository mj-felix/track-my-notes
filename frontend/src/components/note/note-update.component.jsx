import React, { useContext, useState } from 'react';
import { Row, Col, Button, Spinner, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import AppContext from '../../context/app/app.context.js';
import TooltipPopup from '../misc/tooltip-popup.component.jsx';

const UpdateNote = ({ setIsBeingUpdated, isDraft, setIsDraft, handleDelete, deleteLoading }) => {
    const appContext = useContext(AppContext);
    const { note, updateNote, noteLoading } = appContext;

    const [updateLoading, setUpdateLoading] = useState(false);
    const [title, setTitle] = useState(note.title);
    const [isPublic, setIsPublic] = useState(note.isPublic);
    const [isSticky, setIsSticky] = useState(note.isSticky);
    const [madePublicAt, setMadePublicAt] = useState(note.madePublicAt ? note.madePublicAt.substring(0, 10) : '');
    const [link, setLink] = useState(note.link ? note.link : '');
    const [description, setDescription] = useState(note.description);


    const handleSubmit = async e => {
        e.preventDefault();
        setUpdateLoading(true);
        const isNoteUpdated = await updateNote(note._id, {
            title,
            isPublic,
            isSticky,
            madePublicAt,
            link,
            description,
            tags: note.tags.map(tag => tag._id)
        });
        if (isNoteUpdated) {
            setIsBeingUpdated(false);
            setIsDraft(false);
        } else {
            setUpdateLoading(false);
        }
    };

    return (
        <>
            <h2>{isDraft ? 'Draft Note' : 'Update Note'}</h2>
            <Form onSubmit={handleSubmit} className='py-2 mt-3'>
                <Row>
                    <Col xs={12}>
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId='isSticky'>
                                <Form.Label>
                                    Sticky? <TooltipPopup
                                        msg='Sticky note appear at the top.'
                                        placement='right'
                                    >
                                        <FontAwesomeIcon size='sm' icon={faInfoCircle} />
                                    </TooltipPopup>
                                </Form.Label>
                                <Form.Check
                                    type='switch'
                                    checked={isSticky}
                                    onChange={(e) => setIsSticky(!isSticky)}
                                    className='ml-2'
                                />
                            </Form.Group>
                            <Form.Group as={Col} xs={3} controlId='isPublic'>
                                <Form.Label>
                                    Public? <TooltipPopup
                                        msg='Public note can be accessed by anyone.'
                                        placement='right'
                                    >
                                        <FontAwesomeIcon size='sm' icon={faInfoCircle} />
                                    </TooltipPopup>
                                </Form.Label>
                                <Form.Check
                                    type='switch'
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(!isPublic)}
                                    className='ml-2'
                                />
                            </Form.Group>
                            <Form.Group as={Col} xs={6} controlId='madePublicAt'>
                                <Form.Label>
                                    Publication Date <TooltipPopup
                                        msg='Notes (even non-public ones) are sorted by publication date.'
                                        placement='right'
                                    >
                                        <FontAwesomeIcon size='sm' icon={faInfoCircle} />
                                    </TooltipPopup>
                                </Form.Label>
                                <Form.Control
                                    type='date'
                                    placeholder='Enter publication date'
                                    value={madePublicAt}
                                    onChange={(e) => setMadePublicAt(e.target.value)}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={12} md={6} controlId='title'>
                                <Form.Label>
                                    Title
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6} controlId='link'>
                                <Form.Label>
                                    Link
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter URL'
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId='description'>
                            <Form.Label>
                                Description <TooltipPopup
                                    msg='Allowed tags and attributes: b, strong, i, em, a[href, target], p, li, ul, ol, img[src, alt, class, style], h1, h2, h3, br, pre. Use ONLY attached images.'
                                    placement='right'
                                >
                                    <FontAwesomeIcon size='sm' icon={faInfoCircle} />
                                </TooltipPopup>
                            </Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={9}
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    {!isDraft &&
                        <Col xs={4}>
                            <Button variant='warning' className='w-100 my-2' disabled={noteLoading}
                                onClick={() => { setIsBeingUpdated(false); }}>
                                Cancel
                            </Button>
                        </Col>
                    }
                    <Col xs={isDraft ? 6 : 4}>
                        <Button variant='danger' className='w-100 my-2' disabled={noteLoading}
                            onClick={handleDelete}>
                            Delete
                            {isDraft && ' Draft'}
                            {' '}
                            {deleteLoading &&
                                <Spinner animation="border" size='sm' variant='light' role="status" />
                            }
                        </Button>
                    </Col>
                    <Col xs={isDraft ? 6 : 4}>
                        <Button type='submit' variant='info' className='w-100 my-2' disabled={noteLoading}>
                            Save{' '}
                            {updateLoading &&
                                <Spinner animation="border" size='sm' variant='light' role="status" />
                            }
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default UpdateNote;