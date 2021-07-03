const errors = require('../messages/errorMessages.js');

module.exports.notFoundError = (req, res, next) => {
    const error = new Error(`${errors.app.NOT_FOUND}: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};