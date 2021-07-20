import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';

const UpdateTag = ({ handleUpdate, tag, cancelUpdate, isBeingUpdated }) => {

    const [tagName, setTagName] = useState(tag.name);

    return (
        <tr>
            <td className='font-weight-bolder pl-4' style={{ width: '70%' }}>
                <Form.Control
                    type='text'
                    placeholder='Enter tag name'
                    value={tagName}
                    required
                    disabled={isBeingUpdated}
                    onChange={(e) => setTagName(e.target.value.toLowerCase())}
                    onKeyPress={(e) => {
                        if (e.charCode === 13) {
                            handleUpdate(tag._id, tagName);
                        }
                    }}
                />
            </td>
            <td className='text-right pr-4 align-middle'>
                {isBeingUpdated ?
                    <Spinner animation="border" size='sm' variant='dark' role="status" /> :
                    <>
                        <FontAwesomeIcon size='lg' icon={faSave} className='mr-4 pointer' style={{ width: '21' }} onClick={() => { handleUpdate(tag._id, tagName); }} />
                        <FontAwesomeIcon size='lg' icon={faTimesCircle} className='pointer' onClick={() => { cancelUpdate({}); }} />
                    </>
                }
            </td>
        </tr>
    );
};

UpdateTag.propTypes = {
    tag: PropTypes.object.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    cancelUpdate: PropTypes.func.isRequired,
    isBeingUpdated: PropTypes.bool.isRequired,
};

export default UpdateTag;