const mongoose = require('mongoose');

const dropDB = (done) => {
    mongoose.connect(
        'mongodb://localhost:27017/track-my-notes',
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },
        () => {
            mongoose.connection.db.dropDatabase(() => {
                mongoose.connection.close();
                done();
            });
        });
};

exports.mochaHooks = {
    beforeAll(done) {
        dropDB(done);
    },
    afterAll(done) {
        dropDB(done);
    }
};