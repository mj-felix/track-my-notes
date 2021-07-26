import React, { useEffect, useContext, useState } from 'react';
import { Container, Spinner, Row, Col } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';
import FadeableAlert from '../../components/misc/fadeable-alert.component.jsx';
import Note from '../../components/note/note.component.jsx';
import UpdateNote from '../../components/note/note-update.component.jsx';
import AddTag from '../../components/tag/tag-add.component.jsx';
import NoteTags from '../../components/note/note-tags.component.jsx';
import NoteFiles from '../../components/note/note-files.component.jsx';
import AddFile from '../../components/note/note-add-file.component.jsx';

const NotePage = ({ match, history }) => {
    const appContext = useContext(AppContext);
    const { accessToken, note, loading, error, eraseError, createNote, eraseNote, fetchNote, fetchTags, tags, deleteNote, notes, setNote } = appContext;

    const [isBeingUpdated, setIsBeingUpdated] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = async () => {
        if (!isDraft && !window.confirm(`You are about to delete '${note.title}' note.\n\nDo you want to proceed?`)) {
            return;
        }
        setDeleteLoading(true);
        const isNoteDeleted = await deleteNote(note._id);
        if (isNoteDeleted) {
            history.replace('/notes');
        } else {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        const asyncCreateNote = async () => {
            const createdNote = await createNote({ title: 'Draft title' });
            if (createdNote) {
                setIsBeingUpdated(true);
                setIsDraft(true);
                history.replace(`/note/${createdNote._id}`);
            }
        };

        if (accessToken) {
            if (match.params.id === 'new') {
                asyncCreateNote();
            } else {
                if (tags.length === 0) {
                    fetchTags();
                }
                const fetchedNote = notes && notes.notes && notes.notes.length > 0 && notes.notes.find(note => note._id === match.params.id);
                if (fetchedNote) {
                    setNote(fetchedNote);
                } else {
                    fetchNote(match.params.id);
                }
            }
        }
        return () => {
            eraseError();
            eraseNote();
        };
        // eslint-disable-next-line
    }, [accessToken, match, history]);

    return (
        <Container>
            {loading &&
                <Container className='text-center'>
                    <Spinner animation="border mb-3" size='lg' variant='dark' role="status" />
                </Container>
            }
            {error &&
                <FadeableAlert msg={error} variant='danger' cb={eraseError} />
            }
            <Row>
                <Col xs={12} md={8} className='pb-3'>
                    {note && (
                        isBeingUpdated ?
                            <UpdateNote setIsBeingUpdated={setIsBeingUpdated} isDraft={isDraft} setIsDraft={setIsDraft} handleDelete={handleDelete} deleteLoading={deleteLoading} />
                            :
                            <Note setIsBeingUpdated={setIsBeingUpdated} handleDelete={handleDelete} deleteLoading={deleteLoading} />
                    )
                    }
                </Col>
                <Col xs={12} md={4} className='pb-3'>
                    {note && tags &&
                        <>
                            <h2>Tags</h2>
                            <AddTag isNotePage />
                            <hr />
                            <NoteTags />
                        </>
                    }
                    {note &&
                        <>
                            <h2 className='mt-4'>Attachements</h2>
                            <AddFile isNotePage />
                            <NoteFiles />
                        </>
                    }
                </Col>
            </Row>
        </Container>
    );
};

export default NotePage;