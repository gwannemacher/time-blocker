import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import * as dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

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
    dayjs.extend(LocalizedFormat);

    const { isAllDay, newDate, addEvent, hideForm } = props;

    const [newTitle, setNewTitle] = useState('');
    const [eventType, setEventType] = useState('meeting');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        setStartTime(newDate);
        const endTime = dayjs(newDate).add(1, 'hour');
        setEndTime(endTime);
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

    const toTimeString = (date) => {
        return dayjs(date).format('LT')?.toLowerCase()?.replace(/\s/g, '');
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
                    <input className="time-inputs" type="text" value={toTimeString(startTime) ?? ''} onChange={onHandleStartTimeChange} />
                    <span className="time-inputs-text">to</span>
                    <input className="time-inputs" type="text" value={toTimeString(endTime) ?? ''} onChange={onHandleStopTimeChange} />
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