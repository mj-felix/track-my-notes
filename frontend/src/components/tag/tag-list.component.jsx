import React, { useEffect, useContext, useState } from 'react';
import { Container, Spinner, Table } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';
import AuthContext from '../../context/auth/auth.context.js';
import FadeableAlert from '../misc/fadeable-alert.component.jsx';
import Tag from './tag.component.jsx';
import UpdateTag from './tag-update.component.jsx';

const TagList = () => {
    const appContext = useContext(AppContext);
    const { fetchTags, eraseError, tags, loading, error, deleteTag, updateTag } = appContext;
    const authContext = useContext(AuthContext);
    const { isLoggedIn } = authContext;

    const [tagBeingDeleted, setTagBeingDeleted] = useState({});
    const [isBeingUpdated, setIsBeingUpdated] = useState(false);
    const [tagToBeUpdated, setTagToBeUpdated] = useState({});

    useEffect(() => {
        if (isLoggedIn && tags.length === 0) {
            fetchTags(true);
        }
        return () => eraseError();
        // eslint-disable-next-line
    }, [isLoggedIn]);

    const handleDelete = async (tag) => {
        if (!window.confirm(`You are about to delete '${tag.name}' tag that may be associated with notes. Notes will be untagged but not deleted.\n\nDo you want to proceed?`)) {
            return;
        }
        setTagBeingDeleted(tag);
        await deleteTag(tag._id);
        setTagBeingDeleted({});
    };

    const handleUpdate = async (tagId, tagName) => {
        setIsBeingUpdated(true);
        if (await updateTag(tagId, tagName)) {
            setIsBeingUpdated(false);
            setTagToBeUpdated({});
        } else {
            setIsBeingUpdated(false);
        }
    };

    return (
        <>
            {loading &&
                <Container className='text-center mb-4'>
                    <Spinner animation="border" size='lg' variant='dark' role="status" />
                </Container>
            }
            {error &&
                <FadeableAlert msg={error} variant='danger' cb={eraseError} />
            }
            {tags && (
                <Table hover className='mt-2'>
                    <tbody>
                        {tags.map(tag =>
                            (tagToBeUpdated && tag._id === tagToBeUpdated._id) ?
                                <UpdateTag key={tag._id} tag={tag} handleUpdate={handleUpdate} cancelUpdate={setTagToBeUpdated} isBeingUpdated={isBeingUpdated} /> :
                                (tagBeingDeleted && tag._id === tagBeingDeleted._id) ?
                                    <Tag key={tag._id} tag={tag} isBeingDeleted={true} /> :
                                    <Tag key={tag._id} tag={tag} handleDelete={handleDelete} setTagToBeUpdated={setTagToBeUpdated} />
                        )}
                    </tbody>
                </Table>
            )
            }
        </>
    );
};

export default TagList;