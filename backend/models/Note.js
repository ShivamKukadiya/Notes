const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    // user is foreign key: value is come from user table
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    }
})

module.exports = mongoose.model('notes', NotesSchema);