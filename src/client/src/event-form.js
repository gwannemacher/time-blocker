import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

import { EventTypes } from './event-types.js';
import TitleInput from './event-form-components/title-input.js';
import TimeInput, {
    getTimeOptions,
} from './event-form-components/time-input.js';
import EventTypeInput from './event-form-components/event-type-input.js';
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

const EventForm = (props) => {
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

    const timeOptions = getTimeOptions(newDate);

    return (
        <>
            <Modal show={true} onHide={hideForm}>
                <Modal.Header closeButton />
                <Modal.Body>
                    <TitleInput
                        titleInput={titleInput}
                        newTitle={newTitle}
                        setTitle={setNewTitle}
                    />
                    <EventTypeInput
                        eventType={eventType}
                        setEventType={setEventType}
                    />
                    <div>
                        <TimeInput
                            time={startTime ?? new Date()}
                            setTime={setStartTime}
                            options={timeOptions}
                        />
                        <span className="time-inputs-text">to</span>
                        <TimeInput
                            time={endTime ?? new Date()}
                            setTime={setEndTime}
                            options={timeOptions}
                        />
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

export default EventForm;
