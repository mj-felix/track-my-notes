const errors = require('../messages/error.messages.js');

module.exports.notFoundError = (req, res, next) => {
    const error = new Error(`${errors.app.NOT_FOUND}: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
    const isMongoValidationError = err.name === 'ValidationError';
    const statusCode = !res.statusCode ? 500 : isMongoValidationError ? 400 : res.statusCode;
    res.status(statusCode);
    const json = { message: err.message };
    if (isMongoValidationError) {
        json.errors = [];
        for (const [key, value] of Object.entries(err.errors)) {
            json.errors.push({ field: key, reason: value.message });
        }
    }
    if (process.env.NODE_ENV !== 'production') {
        json.stack = err.stack;
    }
    res.json(json);
};