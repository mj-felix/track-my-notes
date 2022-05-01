import React, { useEffect, useContext, useState } from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";

import AppContext from "../../context/app/app.context.js";
import AuthContext from "../../context/auth/auth.context.js";
import FadeableAlert from "../../components/misc/fadeable-alert.component.jsx";
import Note from "../../components/note/note.component.jsx";
import UpdateNote from "../../components/note/note-update.component.jsx";
import AddTag from "../../components/tag/tag-add.component.jsx";
import NoteTags from "../../components/note/note-tags.component.jsx";
import NoteFiles from "../../components/note/note-files.component.jsx";
import AddFile from "../../components/note/note-add-file.component.jsx";

const NotePage = ({ match, history, location }) => {
  const appContext = useContext(AppContext);
  const {
    note,
    loading,
    error,
    eraseError,
    createNote,
    eraseNote,
    fetchNote,
    fetchTags,
    tags,
    deleteNote,
    notes,
    setNote,
  } = appContext;
  const authContext = useContext(AuthContext);
  const { isLoggedIn } = authContext;

  const [isBeingUpdated, setIsBeingUpdated] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !isDraft &&
      !window.confirm(
        `You are about to delete '${note.title}' note.\n\nDo you want to proceed?`
      )
    ) {
      return;
    }
    setDeleteLoading(true);
    const isNoteDeleted = await deleteNote(note._id);
    if (isNoteDeleted) {
      history.replace("/notes");
    } else {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const isNoteInDraft = (note) => {
      if (
        !note.isSticky &&
        !note.isPublic &&
        note.tags.length === 0 &&
        note.files.length === 0 &&
        note.title === "Draft title" &&
        !note.description &&
        !note.link &&
        !note.madePublicAt
      ) {
        return true;
      }
      return false;
    };
    const asyncCreateNote = async () => {
      const createdNote = await createNote({ title: "Draft title" });
      if (createdNote) {
        history.replace(`/note/${createdNote._id}`);
      }
    };

    const asyncFetchNote = async (id) => {
      const fetchedNote = await fetchNote(id);
      if (fetchedNote && isNoteInDraft(fetchedNote)) {
        setIsBeingUpdated(true);
        setIsDraft(true);
      } else {
        setIsBeingUpdated(false);
        setIsDraft(false);
      }
    };

    if (isLoggedIn) {
      if (match.params.id === "new") {
        asyncCreateNote();
      } else {
        if (tags.length === 0) {
          fetchTags();
        }
        const fetchedNote =
          notes &&
          notes.notes &&
          notes.notes.length > 0 &&
          notes.notes.find((note) => note._id === match.params.id);
        if (fetchedNote) {
          setNote(fetchedNote);
          if (isNoteInDraft(fetchedNote)) {
            setIsBeingUpdated(true);
            setIsDraft(true);
          }
        } else {
          asyncFetchNote(match.params.id);
        }
      }
    }
    return () => {
      eraseError();
      eraseNote();
    };
    // eslint-disable-next-line
  }, [isLoggedIn, location, history]);

  return (
    <Container>
      {loading && (
        <Container className="text-center">
          <Spinner
            animation="border mb-3"
            size="lg"
            variant="dark"
            role="status"
          />
        </Container>
      )}
      {error && <FadeableAlert msg={error} variant="danger" cb={eraseError} />}
      <Row>
        <Col xs={12} md={8} className="pb-3">
          {note &&
            (isBeingUpdated ? (
              <UpdateNote
                setIsBeingUpdated={setIsBeingUpdated}
                isDraft={isDraft}
                setIsDraft={setIsDraft}
                handleDelete={handleDelete}
                deleteLoading={deleteLoading}
              />
            ) : (
              <Note
                setIsBeingUpdated={setIsBeingUpdated}
                handleDelete={handleDelete}
                deleteLoading={deleteLoading}
              />
            ))}
        </Col>
        <Col xs={12} md={4} className="pb-3">
          {note && tags && (
            <>
              <h2>Tags</h2>
              <AddTag isNotePage setIsDraft={setIsDraft} />
              <hr />
              <NoteTags setIsDraft={setIsDraft} />
            </>
          )}
          {note && (
            <>
              <h2 className="mt-4">Attachements</h2>
              <AddFile setIsDraft={setIsDraft} />
              <NoteFiles />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default NotePage;
