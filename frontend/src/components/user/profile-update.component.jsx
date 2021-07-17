import React, { useContext, useState } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import AppContext from '../../context/app/app.context.js';
import TooltipPopup from '../misc/tooltip-popup.component.jsx';

const UpdateProfile = ({ setIsProfileBeingUpdated, setSuccessMessage }) => {
    const appContext = useContext(AppContext);
    const { user, updateUser } = appContext;

    const [loading, setLoading] = useState(false);
    const [profileName, setProfileName] = useState(user.profileName);
    const [isPublic, setIsPublic] = useState(user.isPublic);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [linkedIn, setLinkedIn] = useState(user.linkedIn);
    const [twitter, setTwitter] = useState(user.twitter);
    const [gitHub, setGitHub] = useState(user.gitHub);
    const [homepage, setHomepage] = useState(user.homepage);
    const [bio, setBio] = useState(user.bio);
    const [location, setLocation] = useState(user.location);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const isUserUpdated = await updateUser({
            profileName,
            isPublic,
            firstName,
            lastName,
            linkedIn,
            twitter,
            gitHub,
            homepage,
            bio,
            location
        });
        if (isUserUpdated) {
            setIsProfileBeingUpdated(false);
            setSuccessMessage('Profile updated successfully');
        } else {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className='py-2'>
            <Row>
                <Col xs={12}>
                    <Form.Row>
                        <Form.Group as={Col} xs={10} controlId='profileName'>
                            <Form.Label>
                                Profile Name <TooltipPopup
                                    msg='Profile name is used for your public content.'
                                    placement='right'
                                >
                                    <FontAwesomeIcon size='sm' icon={faInfoCircle} />
                                </TooltipPopup>
                            </Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter profile name'
                                value={profileName}
                                required
                                onChange={(e) => setProfileName(e.target.value.toLowerCase())}
                            />
                        </Form.Group>
                        <Form.Group as={Col} className='text-center' xs={2} controlId='isPublic'>
                            <Form.Label>
                                Public?
                            </Form.Label>
                            <Form.Check
                                type='switch'
                                checked={isPublic}
                                onChange={(e) => setIsPublic(!isPublic)}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId='firstName'>
                            <Form.Label>
                                First Name
                            </Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter first name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId='lastName'>
                            <Form.Label>
                                Last Name
                            </Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter last name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group controlId='linkedIn'>
                        <Form.Label>
                            LinkedIn
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter LinkedIn URL'
                            value={linkedIn}
                            onChange={(e) => setLinkedIn(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='twitter'>
                        <Form.Label>
                            Twitter
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Twitter URL'
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='gitHub'>
                        <Form.Label>
                            GitHub
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter GitHub URL'
                            value={gitHub}
                            onChange={(e) => setGitHub(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='homepage'>
                        <Form.Label>
                            Homepage
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter homepage URL'
                            value={homepage}
                            onChange={(e) => setHomepage(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='bio'>
                        <Form.Label>
                            Bio
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter bio'
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='location'>
                        <Form.Label>
                            Location
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter location'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={6}>
                    <Button variant='warning' className='w-100 my-2'
                        onClick={() => { setIsProfileBeingUpdated(false); }}>
                        Cancel
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button type='submit' variant='info' className='w-100 my-2' disabled={loading}>
                        Save{' '}
                        {loading &&
                            <Spinner animation="border" size='sm' variant='light' role="status" />
                        }
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateProfile;