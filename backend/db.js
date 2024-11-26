const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/CloudNotebook';

// MongoDB Atlas Connection
// const mongoURI = 'mongodb+srv://cloudnote:<password>@cluster0.2z22b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// const connectToMongo = () => {
//     mongoose.connect(mongoURI, {
//         useNewUrlParser: true,
//         userCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false
//     }).then(() => {
//         console.log("Connection Successfull")
//     }).catch(() => { (err) => console.log("No Connection") })
//     console.log("Connected to Mongo Successfully");
// }

const connectToMongo = () => {
    mongoose.connect(mongoURI)
        .then(() => { console.log("Connection Successfull") })
        .catch(() => { (err) => console.log("No Connection") })
    console.log("Connected to Mongo Successfully");
}

module.exports = connectToMongo;