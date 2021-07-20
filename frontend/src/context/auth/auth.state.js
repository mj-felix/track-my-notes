import React, { useReducer } from 'react';
import axios from 'axios';

import AuthContext from './auth.context.js';
import authReducer from './auth.reducer.js';
import { AuthActionTypes } from './auth.types.js';
import { validateProfileName, validatePassword } from '../../utils/validateUser.js';

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
        const isProfileNameInvalid = validateProfileName(profileName);
        console.log(isProfileNameInvalid);
        if (isProfileNameInvalid) {
            dispatch({
                type: AuthActionTypes.AUTH_FAILURE,
                payload: { 'message': isProfileNameInvalid }
            });
            return;
        }

        const isPasswordInvalid = validatePassword(password);
        if (isPasswordInvalid) {
            dispatch({
                type: AuthActionTypes.AUTH_FAILURE,
                payload: { 'message': isPasswordInvalid }
            });
            return;
        }

        // passwords match validation
        if (password !== repeatPassword) {
            dispatch({
                type: AuthActionTypes.AUTH_FAILURE,
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
                type: AuthActionTypes.AUTH_FAILURE,
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
                type: AuthActionTypes.AUTH_FAILURE,
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