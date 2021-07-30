import React, { useContext, useEffect } from 'react';
import { Container, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

import PublicContext from '../../context/public/public.context.js';
import FadeableAlert from '../../components/misc/fadeable-alert.component.jsx';
import { removeProtocol } from '../../utils/manipulateString.js';

const PublicProfile = ({ match }) => {
    const publicContext = useContext(PublicContext);
    const { loading, error, eraseError, profile, fetchPublicProfile } = publicContext;

    useEffect(() => {
        if (!profile || profile.profileName !== match.params.profileName) {
            fetchPublicProfile(match.params.profileName);
        }
        return () => eraseError();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {loading &&
                <Container className='text-center'>
                    <Spinner animation="border" size='lg' variant='dark' role="status" />
                </Container>
            }
            {error &&
                <Container>
                    <FadeableAlert msg={error} variant='danger' cb={eraseError} />
                </Container>
            }

            {profile &&
                <Container className='bg-light pt-2 pb-3 border col-sm-12 col-lg-6'>
                    {profile.isPublic ?
                        <Badge variant='success' className='mr-3 mt-2'>public profile</Badge> :
                        <Badge variant='danger' className='mr-3 mt-2'>non-public profile</Badge>
                    }
                    {profile.publicNotesExist &&
                        <Link to={`/user/${profile.profileName}/notes`}>
                            See Notes
                        </Link>
                    }
                    {profile.isPublic &&
                        <Row>
                            <Col xs='12' className='py-2 mb-1'>
                                <h3 className='mb-0'>
                                    {profile.firstName} {profile.lastName}
                                    {(profile.firstName || profile.lastName) ?
                                        <> ({profile.profileName})</>
                                        : <>{profile.profileName}</>
                                    }
                                </h3>
                                {profile.location &&
                                    <p className='text-muted font-italic lead mb-0'>
                                        {profile.location}
                                    </p>
                                }
                            </Col>

                            {profile.email &&
                                <Col xs='12' className='py-1 lead'>
                                    <a href={`mailto:${profile.email}`}>
                                        <FontAwesomeIcon icon={faAt} className='mr-2' />
                                        {profile.email}
                                    </a>
                                </Col>
                            }
                            {profile.homepage &&
                                <Col xs='12' className='py-1 lead'>
                                    <a href={profile.homepage} target='_blank' rel='noreferrer'>
                                        <FontAwesomeIcon icon={faGlobe} className='mr-2' />
                                        {removeProtocol(profile.homepage)}
                                    </a>
                                </Col>
                            }
                            {profile.linkedIn &&
                                <Col xs='12' className='py-1 lead'>
                                    <a href={profile.linkedIn} target='_blank' rel='noreferrer'>
                                        <FontAwesomeIcon icon={faLinkedinIn} className='mr-2' style={{ width: '17px' }} />
                                        {removeProtocol(profile.linkedIn)}
                                    </a>
                                </Col>
                            }
                            {profile.twitter &&
                                <Col xs='12' className='py-1 lead'>
                                    <a href={profile.twitter} target='_blank' rel='noreferrer'>
                                        <FontAwesomeIcon icon={faTwitter} className='mr-2' />
                                        {removeProtocol(profile.twitter)}
                                    </a>
                                </Col>
                            }
                            {profile.gitHub &&
                                <Col xs='12' className='py-1 lead'>
                                    <a href={profile.gitHub} target='_blank' rel='noreferrer'>
                                        <FontAwesomeIcon icon={faGithub} className='mr-2' />
                                        {removeProtocol(profile.gitHub)}
                                    </a>
                                </Col>
                            }
                            {profile.bio &&
                                <Col xs='12' className='pb-1 pt-3 lead'>
                                    {profile.bio}
                                </Col>
                            }
                        </Row>
                    }
                </Container>
            }
        </>
    );
};

export default PublicProfile;