import React, { useContext, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';

import AuthContext from '../../context/auth/auth.context.js';

const LogoutPage = () => {
    const authContext = useContext(AuthContext);
    const { logout } = authContext;

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <Container className='text-center'>
            <Spinner animation="border" size='lg' variant='dark' role="status" />
        </Container>
    );
};

export default LogoutPage;