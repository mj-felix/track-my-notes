module.exports = {
    auth: {
        INVALID_CREDENTIALS: 'Credentials invalid',
        REFRESH_TOKEN_FAILED: 'Refresh token failed',
        ACCESS_TOKEN_FAILED: 'Access token failed',
    },
    user: {
        NOT_FOUND: 'User not found',
        INVALID_USER: 'User data invalid',
        EMAIL_EXISTS: 'Email already exists',
        PROFILE_NAME_EXISTS: 'Profile name already exists',
        INVALID_PROFILE_NAME: 'Profile name must have minimum 3 characters, only letters, dash (-) and underscore(_) allowed',
        INVALID_EMAIL: 'Invalid email',
        INVALID_PASSWORD: 'Password must have minimum 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character #@!%*?&-_+',
    },
    tag: {
        TAG_EXISTS: 'Tag already exists',
        INVALID_TAG: 'Tag data invalid',
        NOT_FOUND: 'Tag not found',
        NOT_USERS_TAG: 'Tag does not belong to user',
    },
    note: {
        INVALID_NOTE: 'Note data invalid',
        NOT_FOUND: 'Note not found',
        NOT_USERS_NOTE: 'Note does not belong to user',
    },
    file: {
        NOT_USERS_FILE: 'File does not belong to user',
        INSUFFCIENT_SPACE: 'Insufficient storage space',
    },
    app: {
        NOT_FOUND: 'Resource not found',
        NO_HTTPS_USED: 'Please use HTTPS',
    }
}