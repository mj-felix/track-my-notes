import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import TooltipPopup from '../misc/tooltip-popup.component.jsx';


const NoteTile = ({ note }) => {

    // console.log('NoteTile');

    const generateColor = (color) => {
        // console.log('generateColor');
        const colors = ['primary', 'success', 'info', 'warning'];
        const index = color % 4;
        return colors[index];
    };

    let color = 0;

    return (
        <Card style={{ maxHeight: '500px' }} className='mb-3'>
            <Card.Header as='h5' className='d-flex justify-content-between align-items-start'>
                <div className='mr-1'>
                    <Link to={`/note/${note._id}`}>
                        {note.title.length > 33 ?
                            note.title.substring(0, 30) + '...'
                            :
                            note.title
                        }
                    </Link>
                </div>
                <div className='d-flex flex-nowrap'>
                    {note.files.length > 0 &&
                        <TooltipPopup
                            msg='Note has attachments'
                            placement='left'
                        >
                            <Badge variant='info'>
                                <FontAwesomeIcon size='sm' icon={faPaperclip} />
                            </Badge>
                        </TooltipPopup>
                    }
                    {note.isPublic &&
                        <TooltipPopup
                            msg='Note is public'
                            placement='top'
                        >
                            <Badge variant='success'>P</Badge>
                        </TooltipPopup>
                    }
                    {note.isSticky &&
                        <TooltipPopup
                            msg='Note is shown first'
                            placement='bottom'
                        >
                            <Badge variant='warning' className='text-dark'>S</Badge>
                        </TooltipPopup>
                    }
                    {note.link &&
                        <TooltipPopup
                            msg='Note has a link'
                            placement='top'
                        >
                            <Badge variant='primary'>
                                <a href={note.link} target='_blank' rel='noreferrer'>
                                    <FontAwesomeIcon size='sm' icon={faExternalLinkAlt} />
                                </a>
                            </Badge>
                        </TooltipPopup>
                    }
                </div>
            </Card.Header>

            <Card.Body className='d-flex flex-column justify-content-between'>
                <Card.Text>
                    {note.description &&
                        note.description.length > 300 ? note.description.substring(0, 297) + '...' : note.description
                    }
                </Card.Text>
                <Card.Text>
                    {note.tags.length > 0 && note.tags.map(tag => (
                        <Badge key={tag._id} variant={generateColor(color++)} className='mr-1 mb-1'>
                            <Link to={`/notes?tags=${tag._id}`}>
                                {tag.name}
                            </Link>
                        </Badge>
                    ))
                    }
                </Card.Text>
            </Card.Body>
        </Card >
    );
};

export default NoteTile;;