import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';

export const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updatenote } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div className='note-title'>
                            <h5 className="card-title">{note.title}</h5>
                        </div>
                        <div className="icon">
                            <i className="fa-solid fa-pen-to-square mx-2" onClick={() => { updatenote(note) }}></i>
                            <i className="fa-regular fa-trash-can" onClick={() => { deleteNote(note._id);props.showAlert("success", "Deleted Successfully.") }}></i>
                        </div>
                    </div>
                    <p className="card-text">{note.desc}</p>
                </div>
            </div>
        </div>
    )
}
