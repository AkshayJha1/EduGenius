const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDb`);
    } catch (error) {
        console.log(`MongoDB connection error : ${error}`);
    }
}

module.exports = connectDb;