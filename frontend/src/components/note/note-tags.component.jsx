import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';

const NoteTags = ({ setIsDraft }) => {
    const appContext = useContext(AppContext);
    const { note, tags, updateNote, noteLoading } = appContext;

    const addTagToNote = async (tagId) => {
        let newTags = note.tags.map(tag => tag._id);
        newTags.push(tagId);
        await updateNote(note._id, {
            ...note,
            tags: newTags
        });
        setIsDraft(false);
    };

    const removeTagFromNote = async (tagId) => {
        let newTags = note.tags.map(tag => tag._id);
        newTags = newTags.filter(tag => tag !== tagId);
        await updateNote(note._id, {
            ...note,
            tags: newTags
        });
    };

    return (
        <>
            {tags.map(tag => {
                const isNotesTag = note.tags.map(tag => tag._id).includes(tag._id);
                const handleClick = isNotesTag ? removeTagFromNote : addTagToNote;
                return (
                    <Button
                        key={tag._id}
                        variant={isNotesTag ? 'primary' : 'secondary'}
                        className='mr-1 mb-1'
                        size='sm'
                        disabled={noteLoading}
                        onClick={(e) => {
                            handleClick(tag._id);
                            e.target.blur();
                        }
                        }
                    >{tag.name}</Button>
                );
            }
            )}
        </>


    );
};

export default NoteTags;