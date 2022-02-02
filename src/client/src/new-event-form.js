import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

import { EventTypes } from './form-constants.js';
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

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    };

    const handleTypeChange = (event) => {
        setEventType(event.target.value);
    };

    const handleStartTimeChange = (e) => {
        setStartTime(new Date(e.target.value));
    };

    const handleStopTimeChange = (e) => {
        setEndTime(new Date(e.target.value));
    };

    const getTimeOptions = (newDate) => {
        if (!dayjs(newDate).isValid()) {
            return [];
        }

        const toTimeOption = (date, hours, minutes) => {
            let timeOptionDate = new Date(date.getTime());
            timeOptionDate.setHours(hours);
            timeOptionDate.setMinutes(minutes);
            return timeOptionDate;
        };

        const times = [];
        for (let i = 0; i < 24; i++) {
            const date0Minutes = toTimeOption(newDate, i, 0);
            const date30Minutes = toTimeOption(newDate, i, 30);

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
        let newTitlePrefix = '';
        if (eventType === EventTypes.MEETING) {
            newTitlePrefix = '🔇🔊 ';
        } else if (eventType.includes('focusmate')) {
            newTitlePrefix = '👩🏻‍💻👩‍💻 ';
        }

        let className = '';
        if (eventType === EventTypes.MEETING) {
            className = 'calendar-meeting-event';
        } else if (eventType === EventTypes.FOCUSMATE_WORK) {
            className = 'calendar-focusmate-work-event';
        } else if (eventType === EventTypes.FOCUSMATE_PERSONAL) {
            className = 'calendar-focusmate-personal-event';
        } else if (eventType === EventTypes.PERSONAL) {
            className = 'calendar-personal-event';
        }

        const newEvent = isAllDay
            ? toAllDayCalendarEvent(startTime, newTitlePrefix + newTitle)
            : toCalendarEvent(
                  startTime,
                  endTime,
                  newTitlePrefix + newTitle,
                  className
              );
        addEvent(newEvent);

        setNewTitle('');
        setEventType('meeting');
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
                        onChange={handleTitleChange}
                    />
                    <select value={eventType} onChange={handleTypeChange}>
                        <option value={EventTypes.MEETING}>Meeting</option>
                        <option value={EventTypes.FOCUSMATE_WORK}>
                            Focusmate (work)
                        </option>
                        <option value={EventTypes.FOCUSMATE_PERSONAL}>
                            Focusmate (personal)
                        </option>
                        <option value={EventTypes.MISC}>Miscellaneous</option>
                        <option value={EventTypes.PERSONAL}>Personal</option>
                    </select>
                    <div>
                        <select
                            className="time-select"
                            value={startTime ?? new Date()}
                            onChange={handleStartTimeChange}
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
                            onChange={handleStopTimeChange}
                        >
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {toTimeString(t)}
                                </option>
                            ))}
                        </select>
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
