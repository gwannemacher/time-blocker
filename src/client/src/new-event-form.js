import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

import { EventTypes } from './event-types.js';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/modal.css';

const toCalendarEvent = (start, end, title, className) => {
    return {
        title,
        start,
        end,
        classNames: [className],
    };
};

const toAllDayCalendarEvent = (start, title) => {
    return {
        title,
        start,
        allDay: true,
    };
};

const NewEventForm = (props) => {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(CustomParseFormat);

    const { isAllDay, newDate, addEvent, hideForm } = props;

    const [newTitle, setNewTitle] = useState('');
    const [eventType, setEventType] = useState('meeting');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        setStartTime(newDate);
        const endDate = dayjs(newDate).add(1, 'hour');
        setEndTime(endDate.toDate());
    }, [newDate]);

    const getTimeOptions = (newDate) => {
        if (!dayjs(newDate).isValid()) {
            return [];
        }

        const toTimeOption = (date, hours, minutes) => {
            const timeOptionDate = new Date(date.getTime());
            timeOptionDate.setHours(hours);
            timeOptionDate.setMinutes(minutes);
            return timeOptionDate;
        };

        const times = [];
        for (let i = 0; i < 24; i++) {
            const [date0Minutes, date30Minutes] = [
                toTimeOption(newDate, i, 0),
                toTimeOption(newDate, i, 30),
            ];

            times.push(date0Minutes);
            times.push(date30Minutes);
        }

        return times;
    };

    const onCancel = () => {
        setNewTitle('');
        setEventType('meeting');
        hideForm();
    };

    const onSave = () => {
        const calendarEventType = EventTypes.select(eventType);

        const newEvent = isAllDay
            ? toAllDayCalendarEvent(
                  startTime,
                  calendarEventType.prefix + newTitle
              )
            : toCalendarEvent(
                  startTime,
                  endTime,
                  calendarEventType.prefix + newTitle,
                  calendarEventType.className
              );

        addEvent(newEvent);

        setNewTitle('');
        setEventType(EventTypes.MEETING.id);
        hideForm();
    };

    const titleInput = useRef(null);
    useEffect(() => {
        titleInput.current.focus();
    }, []);

    const toTimeString = (date) => {
        return dayjs(date).format('LT')?.toLowerCase()?.replace(/\s/g, '');
    };

    const timeOptions = getTimeOptions(newDate);

    return (
        <>
            <Modal show={true} onHide={hideForm}>
                <Modal.Header closeButton />
                <Modal.Body>
                    <input
                        ref={titleInput}
                        type="text"
                        placeholder="Add title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                    >
                        <option value={EventTypes.MEETING.id}>
                            {EventTypes.MEETING.name}
                        </option>
                        <option value={EventTypes.FOCUSMATE_WORK.id}>
                            {EventTypes.FOCUSMATE_WORK.name}
                        </option>
                        <option value={EventTypes.FOCUSMATE_PERSONAL.id}>
                            {EventTypes.FOCUSMATE_PERSONAL.name}
                        </option>
                        <option value={EventTypes.PERSONAL.id}>
                            {EventTypes.PERSONAL.name}
                        </option>
                        <option value={EventTypes.MISC.id}>
                            {EventTypes.MISC.name}
                        </option>
                    </select>
                    <div>
                        <select
                            className="time-select"
                            value={startTime ?? new Date()}
                            onChange={(e) =>
                                setStartTime(new Date(e.target.value))
                            }
                        >
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {toTimeString(t)}
                                </option>
                            ))}
                        </select>
                        <span className="time-inputs-text">to</span>
                        <select
                            className="time-select"
                            value={endTime ?? new Date()}
                            onChange={(e) =>
                                setEndTime(new Date(e.target.value))
                            }
                        >
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {toTimeString(t)}
                                </option>
                            ))}
                        </select>
                        <span className="time-inputs-text">
                            {dayjs(endTime).diff(dayjs(startTime), 'minute')}m
                        </span>
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
};

export default NewEventForm;
