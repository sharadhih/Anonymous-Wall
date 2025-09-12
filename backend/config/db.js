const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if(!process.env.mongoURI) {
            throw new Error("mongoURI is not defined in environment variables");
        }
        await mongoose.connect(process.env.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
