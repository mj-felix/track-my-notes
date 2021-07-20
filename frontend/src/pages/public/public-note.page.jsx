import React, { useEffect, useContext } from 'react';
import { Container, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PublicContext from '../../context/public/public.context.js';
import FadeableAlert from '../../components/misc/fadeable-alert.component.jsx';
import PublicNote from '../../components/note/note-public.component.jsx';


const PublicNotes = ({ match, location }) => {
    const publicContext = useContext(PublicContext);
    const { loading, error, eraseError, notes, note, fetchPublicNote, setPublicNote } = publicContext;

    useEffect(() => {
        if (note && note._id === match.params.noteId) {
            return;
        }
        const fetchedNote = notes && notes.notes && notes.notes.length > 0 && notes.notes.find(note => note._id === match.params.noteId);
        if (fetchedNote) {
            setPublicNote(fetchedNote);
        }
        else {
            fetchPublicNote(match.params.profileName, match.params.noteId);
        }
        return () => eraseError();
        // eslint-disable-next-line
    }, []);

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
            {note &&
                <Container>
                    <Card className='mb-3'>
                        <Card.Body className='py-2 bg-light'>
                            <Link to={`/user/${match.params.profileName}`}>
                                {match.params.profileName}
                            </Link>
                            {' '}&rarr;{' '}
                            <Link to={`/user/${match.params.profileName}/notes`}>
                                Notes
                            </Link>
                            {' '}&rarr; {note.title}
                        </Card.Body>
                    </Card>
                    <PublicNote note={note} match={match} location={location} />
                </Container>
            }
        </>
    );
};

export default PublicNotes;