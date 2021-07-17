import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';

const NoteTags = () => {
    const appContext = useContext(AppContext);
    const { note, tags, updateNote, noteLoading } = appContext;

    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if (accessToken) {
    //         fetchTags();
    //     }
    //     return () => eraseTags();
    //     // eslint-disable-next-line
    // }, [accessToken]);

    // const getRandomColor = () => {
    //     const colors = ['primary', 'success', 'info', 'warning'];
    //     const randomIndex = Math.floor(Math.random() * colors.length);
    //     return colors[randomIndex];
    // };

    const addTagToNote = async (tagId) => {
        let newTags = note.tags.map(tag => tag._id);
        newTags.push(tagId);
        // setLoading(true);
        await updateNote(note._id, {
            ...note,
            tags: newTags
        });
        // setLoading(false);
    };

    const removeTagFromNote = async (tagId) => {
        let newTags = note.tags.map(tag => tag._id);
        newTags = newTags.filter(tag => tag !== tagId);
        // setLoading(true);
        await updateNote(note._id, {
            ...note,
            tags: newTags
        });
        // setLoading(false);
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