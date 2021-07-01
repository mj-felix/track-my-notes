const jwt = require('jsonwebtoken');

module.exports = generateToken = (content, type) => {
    let expiresIn;
    if (type === 'refresh') expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;
    else if (type === 'access') expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
    else return null;
    return jwt.sign(
        { content },
        process.env.JWT_SECRET,
        { expiresIn: expiresIn }
    );
};