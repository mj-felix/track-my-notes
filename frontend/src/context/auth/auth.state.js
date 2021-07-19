import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './auth.context.js';
import authReducer from './auth.reducer.js';
import {
    AuthActionTypes
} from './auth.types.js';

const AuthState = props => {
    const initialState = {
        refreshToken: localStorage.getItem('refreshToken'),
        accessToken: null,
        loading: false,
        error: null,
        noRedirect: false
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    const register = async ({ profileName, email, password, repeatPassword }) => {
        // profile name validation
        const profileNameRegex = /^[a-zA-Z-_]{3,}$/;
        if (!profileNameRegex.test(profileName)) {
            dispatch({
                type: AuthActionTypes.AUTH_FAIL,
                payload: { 'message': 'Profile name must have minimum 3 characters. Only letters, dash (-) and underscore(_) are allowed.' }
            });
            return;
        }

        // password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@!%*?&-_+])[A-Za-z\d#@!%*?&-_+]{10,}$/;
        if (!passwordRegex.test(password)) {
            dispatch({
                type: AuthActionTypes.AUTH_FAIL,
                payload: { 'message': 'Password must have minimum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character #@!%*?&-_+' }
            });
            return;
        }

        // passwords match validation
        if (password !== repeatPassword) {
            dispatch({
                type: AuthActionTypes.AUTH_FAIL,
                payload: { 'message': 'Passwords do not match' }
            });
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            dispatch({
                type: AuthActionTypes.AUTH_REQUEST,
            });

            const res = await axios.post(
                '/api/v1/auth/register',
                {
                    profileName,
                    email,
                    password
                },
                config);

            localStorage.setItem('refreshToken', res.data.refreshToken);
            dispatch({
                type: AuthActionTypes.AUTH_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AuthActionTypes.AUTH_FAIL,
                payload: err.response.status !== 500 ? err.response.data : { message: 'Something went wrong ... please try again later.' }
            });
        }
    };

    const login = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            dispatch({
                type: AuthActionTypes.AUTH_REQUEST,
            });

            const res = await axios.post('/api/v1/auth/login', formData, config);

            localStorage.setItem('refreshToken', res.data.refreshToken);
            dispatch({
                type: AuthActionTypes.AUTH_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AuthActionTypes.AUTH_FAIL,
                payload: err.response.status !== 500 ? err.response.data : { message: 'Something went wrong ... please try again later.' }
            });
        }
    };

    const refreshAccessToken = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${state.refreshToken}`,
            }
        };

        try {
            const res = await axios.get('/api/v1/auth/refreshaccesstoken', config);
            dispatch({
                type: AuthActionTypes.REFRESH_ACCESS_TOKEN_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            localStorage.removeItem('refreshToken');
            dispatch({ type: AuthActionTypes.LOGOUT });
        }
    };

    const logout = () => {
        localStorage.removeItem('refreshToken');
        dispatch({ type: AuthActionTypes.LOGOUT });
    };

    const eraseError = () => dispatch({ type: AuthActionTypes.ERASE_ERROR });

    return (
        <AuthContext.Provider
            value={{
                refreshToken: state.refreshToken,
                accessToken: state.accessToken,
                loading: state.loading,
                user: state.user,
                error: state.error,
                noRedirect: state.noRedirect,
                register,
                login,
                logout,
                refreshAccessToken,
                eraseError,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;