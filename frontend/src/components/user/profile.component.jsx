import React, { useContext } from 'react';
import { Table, Row, Col, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import AppContext from '../../context/app/app.context.js';

const Profile = ({ setIsProfileBeingUpdated, setAreCredentialsBeingUpdated }) => {
    const appContext = useContext(AppContext);
    const { user } = appContext;

    return (
        <Row>
            <Col xs={12}>
                <Table hover className='mt-1'>
                    <tbody>
                        <tr>
                            <td className='font-weight-bolder'>
                                Email
                            </td>
                            <td>
                                {user.email}
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                Profile Name
                            </td>
                            <td>
                                {user.profileName} {user.isPublic ?
                                    <Badge variant='danger'>
                                        <a href={`/user/${user.profileName}`} target='_blank' rel='noreferrer'>
                                            public profile
                                            <FontAwesomeIcon icon={faLink} className='ml-1' />
                                        </a>
                                    </Badge> :
                                    <Badge variant='success'>non-public profile</Badge>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                First Name
                            </td>
                            <td>
                                {user.firstName}
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                Last Name
                            </td>
                            <td>
                                {user.lastName}
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                LinkedIn
                            </td>
                            <td>
                                <a href={user.linkedIn} target='_blank' rel='noreferrer'>
                                    {user.linkedIn}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                Twitter
                            </td>
                            <td>
                                <a href={user.twitter} target='_blank' rel='noreferrer'>
                                    {user.twitter}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                GitHub
                            </td>
                            <td>
                                <a href={user.gitHub} target='_blank' rel='noreferrer'>
                                    {user.gitHub}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                Homepage
                            </td>
                            <td>
                                <a href={user.homepage} target='_blank' rel='noreferrer'>
                                    {user.homepage}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                Location
                            </td>
                            <td>
                                {user.location}
                            </td>
                        </tr>
                        <tr>
                            <td className='font-weight-bolder'>
                                Bio
                            </td>
                            <td>
                                {user.bio}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <Col xs={6}>
                <Button variant='warning' className='w-100 mb-3'
                    onClick={() => { setAreCredentialsBeingUpdated(true); }}>
                    Update&nbsp;Credentials
                </Button>
            </Col>
            <Col xs={6}>
                <Button variant='info' className='w-100 mb-3'
                    onClick={() => { setIsProfileBeingUpdated(true); }}>
                    Update&nbsp;Profile
                </Button>
            </Col>
        </Row>

    );
};

export default Profile;