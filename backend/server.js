const express = require('express');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');

const connectToDB = require('./database/connect.js');
const { notFoundError, errorHandler } = require('./middleware/errorMiddleware.js');
const sanitizeReqBody = require('./middleware/sanitizeMiddleware.js');

const app = express();
app.use(express.json());
app.use(sanitizeReqBody);

// Mongo injection prevention
app.use(mongoSanitize({ replaceWith: '_' }));

// Use .env configuration and Morgan logging in dev
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    const morgan = require('morgan');
    app.use(morgan(':user-agent :date[iso] :method :url :status :response-time ms - :res[content-length]'));
}

// herokuapp.com subdomain permanent redirection
if (process.env.PROVIDER === 'heroku' && process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.hostname.includes('track-my-notes')) {
            res.redirect(301, 'https://trackmynotes.mjfelix.dev');
        }
        else
            next();
    });
}

// redirection to https - heroku way
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(301, `https://${req.header('host')}${req.url}`);
        else
            next();
    });
}

// Use imported routes
app.use('/api/v1/auth', require('./routes/authRoutes.js'));
app.use('/api/v1/users', require('./routes/userRoutes.js'));
app.use('/api/v1/tags', require('./routes/tagRoutes.js'));
app.use('/api/v1/notes', require('./routes/noteRoutes.js'));
app.use('/api/v1/notes', require('./routes/fileRoutes.js'));
app.use('/api/v1/public', require('./routes/publicRoutes.js'));

// Conntect to  MongoDB
connectToDB();

// Serve React app in Prod
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running ...');
    });
}

// Error handling
app.use(notFoundError);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(
    port,
    () => {
        console.log(`${new Date().toString()}: Server started on port ${port}`);
    }
);