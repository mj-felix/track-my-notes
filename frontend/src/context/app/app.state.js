import React, { useReducer, useContext } from 'react';
import axios from 'axios';

import AuthContext from '../auth/auth.context.js';
import AppContext from './app.context.js';
import appReducer from './app.reducer.js';
import { AppActionTypes } from './app.types.js';
import { validateProfileName, validatePassword } from '../../utils/validate-user.utils.js';

const AppState = props => {
    const authContext = useContext(AuthContext);
    const { accessToken } = authContext;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    };

    const initialState = {
        loading: false,
        noteLoading: false,
        error: null,
        tags: [],
        user: null,
        note: null,
        notes: [],
    };

    const [state, dispatch] = useReducer(appReducer, initialState);

    const eraseError = () => dispatch({ type: AppActionTypes.ERASE_ERROR });

    const eraseNote = () => dispatch({ type: AppActionTypes.ERASE_NOTE });

    const eraseNotes = () => dispatch({ type: AppActionTypes.ERASE_NOTES });

    const updateUser = async (user) => {
        const isProfileNameInvalid = validateProfileName(user.profileName);
        if (isProfileNameInvalid) {
            dispatch({
                type: AppActionTypes.UPDATE_USER_FAILURE,
                payload: isProfileNameInvalid
            });
            return;
        }

        const isPasswordInvalid = validatePassword(user.password);
        if (isPasswordInvalid) {
            dispatch({
                type: AppActionTypes.UPDATE_USER_FAILURE,
                payload: isPasswordInvalid
            });
            return;
        }

        if (user.password && user.password !== user.repeatPassword) {
            dispatch({
                type: AppActionTypes.UPDATE_USER_FAILURE,
                payload: 'Passwords do not match'
            });
            return;
        }

        try {
            const res = await axios.put('/api/v1/users/profile', user, config);
            dispatch({
                type: AppActionTypes.UPDATE_USER_SUCCESS,
                payload: res.data
            });
            return true;
        } catch (err) {
            dispatch({
                type: AppActionTypes.UPDATE_USER_FAILURE,
                payload: err.response.data.message
            });
            return false;
        }
    };

    const fetchUser = async () => {
        try {
            dispatch({ type: AppActionTypes.START_REQUEST });
            const res = await axios.get('/api/v1/users/profile', config);
            dispatch({
                type: AppActionTypes.FETCH_USER_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AppActionTypes.FETCH_USER_FAILURE,
                payload: 'Fetching profile failed ... please refresh the page.'
            });
        }
    };

    const fetchTags = async (isTagPage) => {
        try {
            dispatch({ type: AppActionTypes.START_REQUEST });
            const res = await axios.get('/api/v1/tags', config);
            if (res.data && res.data.length === 0) {
                if (isTagPage) {
                    dispatch({
                        type: AppActionTypes.FETCH_TAGS_FAILURE,
                        payload: 'No tags found. Add a new tag.'
                    });
                }
            } else {
                dispatch({
                    type: AppActionTypes.FETCH_TAGS_SUCCESS,
                    payload: res.data
                });
            }
        } catch (err) {
            dispatch({
                type: AppActionTypes.FETCH_TAGS_FAILURE,
                payload: 'Fetching tags failed ... please refresh the page.'
            });
        }
    };

    const updateTag = async (id, name) => {
        try {
            const res = await axios.put(
                `/api/v1/tags/${id}`,
                { name },
                config);
            dispatch({
                type: AppActionTypes.UPDATE_TAG_SUCCESS,
                payload: res.data
            });
            return true;
        } catch (err) {
            dispatch({
                type: AppActionTypes.UPDATE_TAG_FAILURE,
                payload: 'Updating tag failed ... please try again.'
            });
            return false;
        }
    };

    const addTag = async (name) => {
        try {
            dispatch({
                type: AppActionTypes.START_NOTE_REQUEST,
            });
            const res = await axios.post(
                '/api/v1/tags',
                { name },
                config);
            dispatch({
                type: AppActionTypes.ADD_TAG_SUCCESS,
                payload: res.data
            });
            return res.data._id;
        } catch (err) {
            dispatch({
                type: AppActionTypes.ADD_TAG_FAILURE,
            });
            return false;
        }
    };

    const deleteTag = async (id) => {
        try {
            await axios.delete(
                `/api/v1/tags/${id}`,
                config);
            dispatch({
                type: AppActionTypes.DELETE_TAG_SUCCESS,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: AppActionTypes.DELETE_TAG_FAILURE,
                payload: 'Deleting tag failed ... please try again.'
            });
        }
    };

    const deleteFile = async (noteId, storedFileName) => {
        try {
            dispatch({ type: AppActionTypes.START_NOTE_REQUEST });
            const res = await axios.delete(
                `/api/v1/notes/${noteId}/files/${storedFileName}`,
                config);
            dispatch({
                type: AppActionTypes.DELETE_FILE_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AppActionTypes.DELETE_FILE_FAILURE,
                payload: 'Deleting file failed ... please try again.'
            });
        }
    };

    const uploadFile = async (noteId, file) => {
        try {
            dispatch({ type: AppActionTypes.START_NOTE_REQUEST });
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(
                `/api/v1/notes/${noteId}/files`,
                formData,
                config);
            dispatch({
                type: AppActionTypes.UPLOAD_FILE_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AppActionTypes.UPLOAD_FILE_FAILURE,
                payload: 'Uploading file failed ... please try again.'
            });
        }
    };

    const createNote = async (note) => {
        try {
            dispatch({ type: AppActionTypes.START_REQUEST });
            const res = await axios.post(
                '/api/v1/notes',
                note,
                config);
            dispatch({
                type: AppActionTypes.CREATE_NOTE_SUCCESS,
            });
            return res.data;
        } catch (err) {
            dispatch({
                type: AppActionTypes.CREATE_NOTE_FAILURE,
                payload: 'Creating note failed ... please refresh the page.'
            });
            return false;
        }
    };

    const deleteNote = async (id) => {
        try {
            dispatch({ type: AppActionTypes.START_NOTE_REQUEST });
            await axios.delete(
                `/api/v1/notes/${id}`,
                config);
            dispatch({
                type: AppActionTypes.DELETE_NOTE_SUCCESS,
            });
            return true;
        } catch (err) {
            dispatch({
                type: AppActionTypes.DELETE_NOTE_FAILURE,
                payload: 'Deleting note failed ... please try again.'
            });
            return false;
        }
    };

    const updateNote = async (id, note) => {
        try {
            dispatch({ type: AppActionTypes.START_NOTE_REQUEST });
            const res = await axios.put(
                `/api/v1/notes/${id}`,
                note,
                config);
            dispatch({
                type: AppActionTypes.UPDATE_NOTE_SUCCESS,
                payload: res.data
            });
            return res.data;
        } catch (err) {
            dispatch({
                type: AppActionTypes.UPDATE_NOTE_FAILURE,
                payload: 'Updating note failed ... please try again.'
            });
            return false;
        }
    };

    const fetchNote = async (id) => {
        try {
            dispatch({ type: AppActionTypes.START_REQUEST });
            const res = await axios.get(`/api/v1/notes/${id}`, config);
            dispatch({
                type: AppActionTypes.FETCH_NOTE_SUCCESS,
                payload: res.data
            });
            return res.data;
        } catch (err) {
            dispatch({
                type: AppActionTypes.FETCH_NOTE_FAILURE,
                payload: 'Fetching note failed ... please refresh the page.'
            });
            return false;
        }
    };

    const setNote = (note) => {
        dispatch({
            type: AppActionTypes.FETCH_NOTE_SUCCESS,
            payload: note,
        });
    };

    const fetchNotes = async (searchCriteria) => {
        try {
            let url = '/api/v1/notes?pageSize=12&' + searchCriteria;
            dispatch({ type: AppActionTypes.START_REQUEST });
            const res = await axios.get(url, config);
            if (res.data.pages > 0 && res.data.pages >= res.data.page) {
                dispatch({
                    type: AppActionTypes.FETCH_NOTES_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: AppActionTypes.FETCH_NOTES_FAILURE,
                    payload: 'No notes found. Add a note or change search criteria.'
                });
            }
            dispatch({
                type: AppActionTypes.FETCH_NOTES_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: AppActionTypes.FETCH_NOTES_FAILURE,
                payload: 'Fetching notes failed ... please refresh the page.'
            });
        }
    };

    return (
        <AppContext.Provider
            value={{
                tags: state.tags,
                user: state.user,
                loading: state.loading,
                noteLoading: state.noteLoading,
                error: state.error,
                note: state.note,
                notes: state.notes,
                fetchTags,
                eraseError,
                addTag,
                deleteTag,
                updateTag,
                fetchUser,
                updateUser,
                createNote,
                eraseNote,
                fetchNote,
                setNote,
                updateNote,
                deleteFile,
                uploadFile,
                fetchNotes,
                eraseNotes,
                deleteNote
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;