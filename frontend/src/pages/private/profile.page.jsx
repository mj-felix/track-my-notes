import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';
import FadeableAlert from '../../components/misc/fadeable-alert.component.jsx';
import Profile from '../../components/user/profile.component.jsx';
import UpdateProfile from '../../components/user/profile-update.component.jsx';
import UpdateCredentials from '../../components/user/credentials-update.component.jsx';

const ProfilePage = () => {
    const appContext = useContext(AppContext);
    const { accessToken, eraseError, loading, error, user, fetchUser } = appContext;

    const [isProfileBeingUpdated, setIsProfileBeingUpdated] = useState(false);
    const [areCredentialsBeingUpdated, setAreCredentialsBeingUpdated] = useState(false);

    useEffect(() => {
        if (accessToken && !user) {
            fetchUser();
        }
        return () => eraseError();
        // eslint-disable-next-line
    }, [accessToken, user]);


    return (
        <>
            <Row className='justify-content-sm-center'>
                <Col xs={12} sm={8} md={6}>
                    <h2 className='py-2'>
                        {isProfileBeingUpdated ?
                            <>Update Profile</> :
                            areCredentialsBeingUpdated ?
                                <>Update Credencials</> :
                                <>Profile</>
                        }
                    </h2>
                </Col>
            </Row>
            <Row className='justify-content-sm-center py-2'>
                <Col xs={12} sm={8} md={6}>
                    {loading ?
                        <Container className='text-center'>
                            <Spinner animation="border" size='lg' variant='dark' role="status" />
                        </Container>
                        :
                        <>
                            {error &&
                                <FadeableAlert msg={error} variant='danger' cb={eraseError} />
                            }
                            {isProfileBeingUpdated &&
                                <UpdateProfile setIsProfileBeingUpdated={setIsProfileBeingUpdated} />
                            }
                            {areCredentialsBeingUpdated &&
                                <UpdateCredentials setAreCredentialsBeingUpdated={setAreCredentialsBeingUpdated} />
                            }
                            {user && !isProfileBeingUpdated && !areCredentialsBeingUpdated &&
                                <Profile
                                    setIsProfileBeingUpdated={setIsProfileBeingUpdated}
                                    setAreCredentialsBeingUpdated={setAreCredentialsBeingUpdated}
                                />
                            }
                        </>
                    }
                </Col>
            </Row>
        </>
    );
};

export default ProfilePage;