import React, { useEffect, useContext, useState } from 'react';
import { Container, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import PublicContext from '../../context/public/public.context.js';
import FadeableAlert from '../../components/misc/fadeable-alert.component.jsx';
import PublicNote from '../../components/note/note-public.component.jsx';
import Paginate from '../../components/misc/paginate.component.jsx';

const PublicNotes = ({ match, location }) => {
    const publicContext = useContext(PublicContext);
    const { loading, error, eraseError, notes, fetchPublicNotes } = publicContext;

    const searchCriteria = queryString.parse(location.search);
    const [tag, setTag] = useState({ name: '...' });

    const asyncFetchPublicNotes = async () => {
        const firstNote = await fetchPublicNotes(match.params.profileName, location.search.substring(1, location.search.length));
        if (searchCriteria.tags && firstNote) {
            setTag(
                firstNote.tags.find(tag => tag._id === searchCriteria.tags)
            );
        }
    };

    useEffect(() => {
        asyncFetchPublicNotes();
        // eslint-disable-next-line
    }, [location]);

    return (
        <>
            {loading &&
                <Container className='text-center'>
                    <Spinner animation="border mb-4" size='lg' variant='dark' role="status" />
                </Container>
            }
            {error &&
                <Container>
                    <FadeableAlert msg={error} variant='danger' cb={eraseError} />
                </Container>
            }
            <Container>
                <Card className='mb-3'>
                    <Card.Body className='py-2 bg-light'>
                        <Link to={`/user/${match.params.profileName}`}>
                            {match.params.profileName}
                        </Link>
                        {' '}&rarr;{' '}
                        {searchCriteria.tags ?
                            <>
                                <Link to={`/user/${match.params.profileName}/notes`}>
                                    Notes
                                </Link> &rarr; [{tag && tag.name}]
                            </>
                            : <>Notes</>
                        }
                    </Card.Body>
                </Card>
            </Container>
            {notes && notes.notes && notes.notes.length > 0 &&
                notes.notes.map(note => (
                    <Container key={note._id}>
                        <PublicNote note={note} match={match} isTile />
                    </Container>
                ))
            }
            {notes && notes.pages > 0 &&
                <Container className='d-flex justify-content-center'>
                    <Paginate pages={notes.pages} page={notes.page} location={location} profileName={match.params.profileName} />
                </Container>
            }
        </>
    );
};

export default PublicNotes;