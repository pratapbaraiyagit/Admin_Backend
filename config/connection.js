require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOOSE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
})

mongoose.connection.on('connected', () => {
    console.log('Connection established successfully');
});

mongoose.connection.on('error', () => {
    console.log('Mongoose connection default error');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Connection close successfully');
        process.exit(0);
    });
});
