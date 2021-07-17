import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';

const AddFile = () => {
    const appContext = useContext(AppContext);
    const { uploadFile, noteLoading, note } = appContext;

    const handleFileSelect = (e) => {
        if (e.target.files.length) {
            uploadFile(note._id, e.target.files[0]);
            e.target.value = null;
        }
    };
    return (
        <>
            <Form.Group controlId="formFile" className="my-3 ml-2">
                <Form.Control
                    type="file"
                    disabled={noteLoading}
                    onChange={handleFileSelect}
                />
            </Form.Group>
        </>
    );
};

export default AddFile;;