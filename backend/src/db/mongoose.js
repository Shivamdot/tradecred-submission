const mongoose = require('mongoose');

// "process.env.MONGODB_URI" for MongoDB Atlas KEY
let MONGODB_URI = process.env.MONGODB_URI; 

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true }).then(() => {
    console.log("Database Connected...");
}).catch(e => {
    console.log(`Database Connection FAILED! \n${e}`);
})

module.exports = {mongoose}