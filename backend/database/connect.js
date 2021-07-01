const mongoose = require('mongoose');

module.exports = connectToDB = async () => {
    const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/track-my-notes';
    try {
        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log(`${new Date(Date.now()).toString()}: MongoDB connected`);
    } catch (error) {
        console.error(`${new Date(Date.now()).toString()}: MongoDB NOT connected (${error.message})`);
        process.exit(1);
    }
};