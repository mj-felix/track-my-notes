import { AuthActionTypes } from './auth.types.js';

const authReducer = (state, action) => {
    switch (action.type) {
        case AuthActionTypes.AUTH_REQUEST:
            return {
                loading: true
            };
        case AuthActionTypes.AUTH_SUCCESS:
            return {
                refreshToken: action.payload.refreshToken,
                loading: false
            };
        case AuthActionTypes.LOGOUT:
            return {
                refreshToken: null,
                accessToken: null,
                loading: false,
                error: null,
                noRedirect: true
            };
        case AuthActionTypes.REFRESH_ACCESS_TOKEN_SUCCESS:
            return {
                ...state,
                accessToken: action.payload.accessToken
            };
        case AuthActionTypes.AUTH_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case AuthActionTypes.ERASE_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export default authReducer;