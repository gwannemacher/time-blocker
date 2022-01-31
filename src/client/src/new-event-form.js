import React, { useState, useRef, useEffect } from 'react';
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

const extractStartTime = (date) => {
    if (!date || JSON.stringify(date) === '{}') {
        return null;
    }

    const [year, month, day, hours, minutes] =
        [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()];

    return new Date(year, month, day, hours, minutes);
}

const getEndTime = (date) => {
    if (!date || JSON.stringify(date) === '{}') {
        return null;
    }

    const [year, month, day, hours, minutes] =
        [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()];
    return new Date(year, month, day, hours + 1, minutes);
}

const NewEventForm = (props) => {
    const { isAllDay, newDate, addEvent, hideForm } = props;

    const [newTitle, setNewTitle] = useState('');
    const [eventType, setEventType] = useState('meeting');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        const startTime = extractStartTime(newDate);
        setStartTime(startTime);

        const endTime = getEndTime(startTime);
        setEndTime(getEndTime(startTime));
    }, [newDate]);

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    }

    const handleTypeChange = (event) => {
        setEventType(event.target.value);
    }

    const onCancel = () => {
        setNewTitle('');
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

    const titleInput = useRef(null);
    useEffect(()=>{
        titleInput.current.focus();
    }, []);

    const onHandleStartTimeChange = (e) => {
        console.log(e);
    }

    const onHandleStopTimeChange = (e) => {
        console.log(e);
    }

    const toString = (date) => {
        const [hours, minutes] = [date?.getHours(), date?.getMinutes()];
        if (hours != null && minutes != null) {
            return `${hours}:${(minutes.toString()).padStart(2, '0')}`;
        }

        return '00:00';
    }

    return (
    <>
        <Modal show={true} onHide={hideForm}>
            <Modal.Header closeButton />
            <Modal.Body>
                <input ref={titleInput} type="text" placeholder="Add title" value={newTitle} onChange={handleTitleChange} />
                <select value={eventType} onChange={handleTypeChange}>
                    <option value="meeting">Meeting</option>
                    <option value="focusmate">Focusmate</option>
                    <option value="unstructured">Unstructured</option>
                    <option value="personal">Personal</option>
                </select>
                <div>
                    <input className="time-inputs" type="text" value={toString(startTime) ?? ''} onChange={onHandleStartTimeChange} />
                    <span className="time-inputs-text">to</span>
                    <input className="time-inputs" type="text" value={toString(endTime) ?? ''} onChange={onHandleStopTimeChange} />
                </div>
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