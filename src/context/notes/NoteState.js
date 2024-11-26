// if you want to use context then write basic stracture below and file named noteContext
// import React from "react";
// import noteContext from "./noteContext";

// const NoteState = (props)=>{
//     return(
//         <NoteState.Provider>
//             {props.children}
//         </NoteState.Provider>
//     )    
// }

// export default NoteState;


import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesinitial = [];
    const [notes, setnotes] = useState(notesinitial);

    //Get All Notes
    const getNote = async () => {
        // fetching notes google: fetch with header
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setnotes(json);
    }

    //Add Note
    const addNote = async (title, desc, tag) => {
        // fetch with headers
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, desc, tag })
        });
        const note = await response.json();
        setnotes(notes.concat(note));
    }

    //Edit Note
    const editNote = async (id, title, desc, tag) => {
        // fetch with headers
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, desc, tag })
        });
        const json = await response.json();
        console.log(json);

        let newNote = JSON.parse(JSON.stringify(notes))
        // logic to edit note client
        for (let index = 0; index < newNote.length; index++) {
            const element = newNote[index];
            if (element._id === id) {
                element.title = title;
                element.desc = desc;
                element.tag = tag;
                break;
            }
        }
        setnotes(newNote);
    }

    //Delete Note
    const deleteNote = async (id) => {
        // fetch with headers
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        const newNote = notes.filter((note) => { return note._id !== id })
        setnotes(newNote);
    }

    return (
        <NoteContext.Provider value={{ notes, getNote, addNote, editNote, deleteNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;