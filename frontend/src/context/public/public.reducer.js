import { PublicActionTypes } from './public.types.js';

const authReducer = (state, action) => {
    switch (action.type) {
        case PublicActionTypes.START_REQUEST:
            return {
                ...state,
                loading: true
            };
        case PublicActionTypes.FETCH_PUBLIC_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                profile: action.payload
            };
        case PublicActionTypes.FETCH_PUBLIC_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                profile: null,
                error: action.payload
            };
        case PublicActionTypes.ERASE_PUBLIC_PROFILE:
            return {
                ...state,
                profile: null
            };
        case PublicActionTypes.FETCH_PUBLIC_NOTES_SUCCESS:
            return {
                ...state,
                loading: false,
                notes: action.payload
            };
        case PublicActionTypes.FETCH_PUBLIC_NOTES_FAILURE:
            return {
                ...state,
                loading: false,
                notes: [],
                error: action.payload
            };
        case PublicActionTypes.ERASE_PUBLIC_NOTES:
            return {
                ...state,
                notes: []
            };
        case PublicActionTypes.FETCH_PUBLIC_NOTE_SUCCESS:
            return {
                ...state,
                loading: false,
                note: action.payload
            };
        case PublicActionTypes.FETCH_PUBLIC_NOTE_FAILURE:
            return {
                ...state,
                loading: false,
                note: null,
                error: action.payload
            };
        case PublicActionTypes.ERASE_PUBLIC_NOTE:
            return {
                ...state,
                note: null
            };
        case PublicActionTypes.ERASE_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export default authReducer;