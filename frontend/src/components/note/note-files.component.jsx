import React, { useContext, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCopy as faCopySolid } from '@fortawesome/free-solid-svg-icons';

import AppContext from '../../context/app/app.context.js';

const NoteFiles = () => {
    const appContext = useContext(AppContext);
    const { note, noteLoading, deleteFile } = appContext;

    const [isBeingCopied, setIsBeingCopied] = useState(null);

    const handleCopyToClipboard = (txt, fileId) => {
        setIsBeingCopied(fileId);
        setTimeout(() => {
            navigator.clipboard.writeText(txt);
            setIsBeingCopied(null);
        }, 200);

    };


    return (
        <Table hover>
            <tbody>
                {note.files.map(file => (
                    <tr key={file._id}>
                        <td>
                            <a href={file.url} target='_blank' rel='noreferrer'>
                                {file.originalFileName.length > 30 ? file.originalFileName.substring(0, 27) + '...' : file.originalFileName}
                            </a>
                        </td>

                        {noteLoading ?
                            <td className='text-right'>
                                <Spinner animation="border" size='sm' variant='dark' role="status" />
                            </td>
                            :
                            <>
                                <td className='text-right'>
                                    <FontAwesomeIcon
                                        size='lg'
                                        icon={isBeingCopied === file._id ? faCopySolid : faCopy}
                                        className='pointer'
                                        onClick={() => { handleCopyToClipboard(file.url, file._id); }}
                                    />
                                </td>
                                <td className='text-right' style={{ width: '40px' }}>
                                    <FontAwesomeIcon
                                        size='lg'
                                        icon={faTrashAlt}
                                        className='pointer'
                                        onClick={() => { deleteFile(note._id, file.storedFileName); }}
                                    />
                                </td>
                            </>
                        }

                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default NoteFiles;;