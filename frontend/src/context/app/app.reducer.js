import { AppActionTypes } from './app.types.js';

const sortTags = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
};

const appReducer = (state, action) => {
    switch (action.type) {
        case AppActionTypes.START_REQUEST:
            return {
                ...state,
                loading: true
            };
        case AppActionTypes.START_NOTE_REQUEST:
            return {
                ...state,
                noteLoading: true
            };
        case AppActionTypes.FETCH_TAGS_SUCCESS:
            return {
                ...state,
                loading: false,
                tags: action.payload
            };
        case AppActionTypes.FETCH_TAGS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case AppActionTypes.ADD_TAG_SUCCESS:
            return {
                ...state,
                noteLoading: false,
                tags: [action.payload, ...state.tags].sort(sortTags)
            };
        case AppActionTypes.ADD_TAG_FAILURE:
            return {
                ...state,
                noteLoading: false
            };
        case AppActionTypes.DELETE_TAG_SUCCESS:
            return {
                ...state,
                tags: state.tags.filter(
                    tag => tag._id !== action.payload
                )
            };
        case AppActionTypes.UPDATE_TAG_SUCCESS:
            return {
                ...state,
                tags: state.tags.map(tag =>
                    tag._id === action.payload._id ? action.payload : tag
                ).sort(sortTags)
            };
        case AppActionTypes.DELETE_TAG_FAILURE:
        case AppActionTypes.UPDATE_TAG_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case AppActionTypes.FETCH_USER_SUCCESS:
        case AppActionTypes.UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            };
        case AppActionTypes.FETCH_USER_FAILURE:
        case AppActionTypes.UPDATE_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case AppActionTypes.CREATE_NOTE_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case AppActionTypes.FETCH_NOTE_SUCCESS:
            return {
                ...state,
                loading: false,
                note: action.payload
            };
        case AppActionTypes.UPDATE_NOTE_SUCCESS:
            return {
                ...state,
                noteLoading: false,
                note: action.payload
            };
        case AppActionTypes.DELETE_NOTE_SUCCESS:
            return {
                ...state,
                noteLoading: false,
                note: null
            };
        case AppActionTypes.CREATE_NOTE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case AppActionTypes.FETCH_NOTE_FAILURE:
        case AppActionTypes.DELETE_NOTE_FAILURE:
            return {
                ...state,
                loading: false,
                noteLoading: false,
                error: action.payload
            };
        case AppActionTypes.UPDATE_NOTE_FAILURE:
            return {
                ...state,
                loading: false,
                noteLoading: false,
                error: action.payload
            };
        case AppActionTypes.ERASE_NOTE:
            return {
                ...state,
                note: null,
            };
        case AppActionTypes.ERASE_NOTES:
            return {
                ...state,
                notes: [],
            };
        case AppActionTypes.UPLOAD_FILE_SUCCESS:
        case AppActionTypes.DELETE_FILE_SUCCESS:
            return {
                ...state,
                noteLoading: false,
                note: action.payload,
            };
        case AppActionTypes.UPLOAD_FILE_FAILURE:
        case AppActionTypes.DELETE_FILE_FAILURE:
            return {
                ...state,
                noteLoading: false,
                error: action.payload,
            };
        case AppActionTypes.FETCH_NOTES_SUCCESS:
            return {
                ...state,
                loading: false,
                notes: action.payload
            };
        case AppActionTypes.FETCH_NOTES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                notes: []
            };
        case AppActionTypes.ERASE_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    };
};

export default appReducer;