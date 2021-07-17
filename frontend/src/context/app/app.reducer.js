import { AppActionTypes } from './app.types.js';

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
                error: action.payload,
                tags: []
            };
        case AppActionTypes.ERASE_ERROR:
            return {
                ...state,
                error: null
            };
        case AppActionTypes.ERASE_TAGS:
            return {
                ...state,
                tags: []
            };
        case AppActionTypes.ADD_TAG_SUCCESS:
            return {
                ...state,
                noteLoading: false,
                tags: [action.payload, ...state.tags].sort(
                    function (a, b) {
                        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    }
                )
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
        case AppActionTypes.DELETE_TAG_FAILURE:
        case AppActionTypes.UPDATE_TAG_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case AppActionTypes.UPDATE_TAG_SUCCESS:
            return {
                ...state,
                tags: state.tags.map(tag =>
                    tag._id === action.payload._id ? action.payload : tag
                ).sort(
                    function (a, b) {
                        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    }
                )
            };
        case AppActionTypes.FETCH_USER_SUCCESS:
        case AppActionTypes.UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            };
        case AppActionTypes.FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                user: null
            };
        case AppActionTypes.UPDATE_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case AppActionTypes.ERASE_USER:
            return {
                ...state,
                user: null
            };
        case AppActionTypes.CREATE_NOTE_SUCCESS:
            return {
                ...state,
                loading: false,
                noteLoading: false
            };
        case AppActionTypes.FETCH_NOTE_SUCCESS:
        case AppActionTypes.UPDATE_NOTE_SUCCESS:
            return {
                ...state,
                loading: false,
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
        case AppActionTypes.FETCH_NOTE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                note: null
            };
        case AppActionTypes.DELETE_NOTE_FAILURE:
            return {
                ...state,
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
        default:
            return state;
    };
};

export default appReducer;