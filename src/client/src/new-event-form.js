import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'

//import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/modal.css';

const toCalendarEvent = (date, title) => {
    const [year, month, day, hours] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];

    const start = new Date(year, month, day, hours);
    const end = new Date(year, month, day, hours + 1);

    return {
        title,
        start,
        end
    }
}

const toAllDayCalendarEvent = (date, title) => {
    const [year, month, day, hours] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];
    const start = new Date(year, month, day, hours);

    return {
        title,
        start,
        allDay: true
    }
}

const NewEventForm = (props) => {
    const { isAllDay, newDate, addEvent, hideForm } = props;

    const [newTitle, setNewTitle] = useState("");
    const [eventType, setEventType] = useState("meeting");

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    }

    const handleTypeChange = (event) => {
        setEventType(event.target.value);
    }

    const onCancel = () => {
        setNewTitle("");
        setEventType('meeting');
        hideForm();
    }

    const onSave = () => {
        let newTitlePrefix = '';
        if (eventType === 'meeting') {
            newTitlePrefix = '🔇🔊 ';
        } else if (eventType === 'focusmate') {
            newTitlePrefix = '👩🏻‍💻👩‍💻 ';
        }

        const newEvent = isAllDay
            ? toAllDayCalendarEvent(newDate, newTitlePrefix + newTitle)
            : toCalendarEvent(newDate, newTitlePrefix + newTitle);

        addEvent(newEvent);

        setNewTitle('');
        setEventType('meeting');
        hideForm();
    }

    return (
    <>
        <Modal show={true} onHide={hideForm}>
            <Modal.Header closeButton />
            <Modal.Body>
                <input type="text" placeholder="Add title" value={newTitle} onChange={handleTitleChange} />
                <select value={eventType} onChange={handleTypeChange}>
                    <option value="meeting">Meeting</option>
                    <option value="focusmate">Focusmate</option>
                    <option value="unstructured">Unstructured</option>
                    <option value="personal">Personal</option>
                </select>
                <button className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn-save" onClick={onSave} type="submit">
                    Save
                </button>
            </Modal.Body>
        </Modal>
    </>
    );
}

export default NewEventForm;