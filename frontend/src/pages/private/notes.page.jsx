import React, { useContext, useEffect } from 'react';
import { Container, Spinner, Row, Col } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';
import FadeableAlert from '../../components/misc/fadeable-alert.component.jsx';
import NoteTile from '../../components/note/note-tile.component.jsx';
import SearchNotes from '../../components/note/notes-search.component.jsx';
import Paginate from '../../components/misc/paginate.component.jsx';

const NotesPage = ({ location, history }) => {
    const appContext = useContext(AppContext);
    const { accessToken, notes, tags, loading, error, eraseError, fetchNotes, fetchTags, eraseNotes } = appContext;

    useEffect(() => {
        if (accessToken) {
            fetchNotes(location.search.substring(1, location.search.length));
            if (tags.length === 0) {
                fetchTags();
            }
        }
        return () => {
            eraseNotes();
            eraseError();
        };
        // eslint-disable-next-line
    }, [accessToken, location]);

    return (
        <Row>
            <Col xs={12} sm={12} md={4} lg={3} xl={3} className='mb-3' style={{ minHeight: '100px' }}>
                {tags.length > 0 &&
                    <SearchNotes history={history} location={location} />
                }
            </Col>
            {error &&
                <Col>
                    <Container>
                        <FadeableAlert msg={error} variant='danger' cb={eraseError} />
                    </Container>
                </Col>
            }
            {loading &&
                <Col>
                    <Container className='text-center'>
                        <Spinner animation="border" size='lg' variant='dark' role="status" />
                    </Container>
                </Col>
            }
            <Col xs={12} sm={12} md={8} lg={9} xl={9} className='card-container'>
                {notes.notes && notes.notes.map(
                    note => (
                        <NoteTile key={note._id} note={note} />
                    ))
                }
            </Col>
            <Col
                xs={{ offset: 0, span: 12 }}
                sm={{ offset: 0, span: 12 }}
                md={{ offset: 4, span: 8 }}
                lg={{ offset: 3, span: 9 }}
                xl={{ offset: 3, span: 9 }}
                className='d-flex justify-content-center mt-3'
            >
                {notes.pages > 0 &&
                    <Paginate pages={notes.pages} page={notes.page} location={location} />
                }
            </Col>
        </Row>
    );
};

export default NotesPage;