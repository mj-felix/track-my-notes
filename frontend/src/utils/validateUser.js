const profileNameRegex = /^[a-zA-Z-_]{3,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@!%*?&-_+])[A-Za-z\d#@!%*?&-_+]{10,}$/;
const INVALID_PROFILE_NAME_MESSAGE = 'Profile name must have minimum 3 characters. Only letters, dash (-) and underscore(_) are allowed.';
const INVALID_PASSWORD_MESSAGE = 'Password must have minimum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character #@!%*?&-_+';

export const validateProfileName = (profileName) => {
    if (!profileName || profileNameRegex.test(profileName)) {
        return false;
    }
    return INVALID_PROFILE_NAME_MESSAGE;
};

export const validatePassword = (password) => {
    if (!password || passwordRegex.test(password)) {
        return false;
    }
    return INVALID_PASSWORD_MESSAGE;
};