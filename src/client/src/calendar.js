import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from 'react-bootstrap/Modal'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Form from 'react-bootstrap/Form'

//import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/calendar.css';
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

const dateClick = (info) => {
    const title = prompt("Time block title", "😱 le time block");
    if (!title) {
        return;
    }

    const newEvent = info.allDay
        ? toAllDayCalendarEvent(info.date, title)
        : toCalendarEvent(info.date, title);

    info.view.calendar.addEvent(newEvent);
}

const eventClick = (info) => {
    if (window.confirm("Delete?")) {
        info.event.remove();
    }
}

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [eventType, setEventType] = useState("meeting");
    const [newDate, setNewDate] = useState({});
    const [isAllDay, setIsAllDay] = useState(false);
    const [calendar, setCalendar] = useState({});

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    }

    const handleTypeChange = (event) => {
        setEventType(event.target.value);
    }

    const onDateClick = (info, showForm) => {
        showForm();
        setNewDate(info.date);
        setIsAllDay(info.allDay);
        setCalendar(info.view.calendar);
    }

    const onCancel = () => {
        setNewTitle("");
        setEventType('meeting');
        setNewDate({});
        setIsAllDay(false);
        setCalendar({});
        setIsFormVisible(false);
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

        calendar.addEvent(newEvent);

        setNewTitle("");
        setEventType('meeting');
        setNewDate({});
        setIsAllDay(false);
        setCalendar({});
        setIsFormVisible(false);
    }

    return (
        <>
            <Modal
                show={isFormVisible}
                onHide={() => setIsFormVisible(false)}
            >
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
            <FullCalendar
                plugins={[ timeGridPlugin, interactionPlugin ]}
                initialView="timeGridWeek"
                nowIndicator={true}
                scrollTime="08:00:00"
                dayHeaderFormat={{weekday: 'long', day: 'numeric'}}
                stickyHeaderDates={true}
                titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
                dateClick={(info) => onDateClick(info, () => setIsFormVisible(true))}
                events={events}
                eventClick={eventClick}
                editable={true}
                eventResizableFromStart={true}
                eventTimeFormat={{hour: 'numeric', minute: '2-digit', meridiem: 'narrow'}}
            />
        </>
    );
}

export default Calendar;