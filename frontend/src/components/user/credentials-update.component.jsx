import React, { useContext, useState } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';

import AppContext from '../../context/app/app.context.js';

const UpdateCredentials = ({ setAreCredentialsBeingUpdated }) => {
    const appContext = useContext(AppContext);
    const { user, updateUser } = appContext;

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const isUserUpdated = await updateUser({
            ...user,
            email,
            password,
            repeatPassword
        });
        if (isUserUpdated) {
            setAreCredentialsBeingUpdated(false);
        } else {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className='py-2'>
            <Row>
                <Col xs={12}>
                    <Form.Group controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='repeatePassword'>
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password again'
                            value={repeatPassword}
                            required
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={6}>
                    <Button variant='warning' className='w-100 my-2'
                        onClick={() => { setAreCredentialsBeingUpdated(false); }}>
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

export default UpdateCredentials;