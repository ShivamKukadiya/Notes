const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

connectToMongo();
const app = express();
const port = 5000;

// if we need to use (req.body) then we need to write this line
app.use(cors());    //you can not reverse api direct from browser this why we need to use core package in express
app.use(express.json());

//Avilable routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`CloudNote Backend listening at http://localhost:${port}`)
})