const express = require('express');
const Note = require('../models/Note');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');  // for validation of data in request
const router = express.Router();

// Route 1: Get all notes of logged in user: GET "/api/notes/fetchallnotes" --login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// Route 2: Add new note of logged in user: POST "/api/notes/addnote" --login required

router.post('/addnote', fetchuser, [
    body('title', 'Enter valid Name').isLength({ min: 3 }),
    body('desc', 'Desription atleast must be five character').isLength({ min: 5 })
], async (req, res) => {

    // check whether user with this email is already exist or not
    try {
        const { title, desc, tag } = req.body;

        // if error occurs then return bed request and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, desc, tag, user: req.user.id //Here id with (req.user.id) :- where user is foreign key and it comes from user collection
        })
        const saveNote = await note.save();
        res.json(saveNote);

        // catch error when code is not run properly
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// Route 3: Update existing note of user: PUT "/api/notes/updatenote" --login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, desc, tag } = req.body;

        // if any below data is empty then it get automatic old value 
        const newNote = {};
        if (title) { newNote.title = title };
        if (desc) { newNote.desc = desc };
        if (tag) { newNote.tag = tag };

        let note = await Note.findById(req.params.id);//Here id with (req.params.id) :- where params used because we need to enter id of particular documents(row)

        // if note is not found then send bed request
        if (!note) { res.status(401).send("Not Found") }

        // if user is not found then send bed request
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        // Updating note by id
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// Route 4: Delete existing note of user: DELETE "/api/notes/deletenote" --login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) { res.status(401).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        // Deleting note by id
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

module.exports = router;