import React, { useReducer } from 'react';
import axios from 'axios';
import PublicContext from './public.context.js';
import publicReducer from './public.reducer.js';
import { PublicActionTypes } from './public.types.js';

const PublicState = props => {
    const initialState = {
        loading: false,
        error: null,
        profile: null,
        notes: null,
        note: null
    };

    const [state, dispatch] = useReducer(publicReducer, initialState);

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const fetchPublicProfile = async (profileName) => {
        try {
            dispatch({ type: PublicActionTypes.START_REQUEST });

            const url = `/api/v1/public/${profileName}`;

            const res = await axios.get(url, config);

            dispatch({
                type: PublicActionTypes.FETCH_PUBLIC_PROFILE_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: PublicActionTypes.FETCH_PUBLIC_PROFILE_FAILURE,
                payload: 'Fetching public profile failed ... please refresh the page.'
            });
        }
    };

    const fetchPublicNotes = async (profileName, searchCriteria) => {
        try {
            dispatch({ type: PublicActionTypes.START_REQUEST });

            const url = `/api/v1/public/${profileName}/notes?pageSize=5&${searchCriteria}`;

            const res = await axios.get(url, config);
            if (res.data.pages > 0 && res.data.pages >= res.data.page) {
                dispatch({
                    type: PublicActionTypes.FETCH_PUBLIC_NOTES_SUCCESS,
                    payload: res.data
                });
                return res.data.notes[0];
            } else {
                dispatch({
                    type: PublicActionTypes.FETCH_PUBLIC_NOTES_FAILURE,
                    payload: 'No public notes found.'
                });
            }
            // dispatch({
            //     type: PublicActionTypes.FETCH_PUBLIC_NOTES_SUCCESS,
            //     payload: res.data
            // });
        } catch (err) {
            dispatch({
                type: PublicActionTypes.FETCH_PUBLIC_NOTES_FAILURE,
                payload: 'Fetching public notes failed ... please refresh the page.'
            });
        }
    };

    const fetchPublicNote = async (profileName, noteId) => {
        try {
            dispatch({ type: PublicActionTypes.START_REQUEST });

            const url = `/api/v1/public/${profileName}/notes/${noteId}`;

            const res = await axios.get(url, config);

            dispatch({
                type: PublicActionTypes.FETCH_PUBLIC_NOTE_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: PublicActionTypes.FETCH_PUBLIC_NOTE_FAILURE,
                payload: 'Fetching public note failed ... please refresh the page.'
            });
        }
    };

    const setPublicNote = (note) => {
        dispatch({
            type: PublicActionTypes.FETCH_PUBLIC_NOTE_SUCCESS,
            payload: note,
        });
    };

    const eraseError = () => dispatch({ type: PublicActionTypes.ERASE_ERROR });

    return (
        <PublicContext.Provider
            value={{
                loading: state.loading,
                error: state.error,
                profile: state.profile,
                notes: state.notes,
                note: state.note,
                fetchPublicProfile,
                fetchPublicNotes,
                fetchPublicNote,
                eraseError,
                setPublicNote
            }}
        >
            {props.children}
        </PublicContext.Provider>
    );
};

export default PublicState;