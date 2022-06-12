import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { useApolloClient } from '@apollo/client';

import EventTypes from '../../models/event-types';
import TitleInput from './title-input';
import TimeInput, { getTimeOptions } from './time-input';
import EventTypeInput from './event-type-input';
import '../../stylesheets/modal.css';
import useCreateTimeBlock from '../../hooks/useCreateTimeBlock';
import useDomEffect from '../../hooks/useDomEffect';
import { TIMEBLOCKS_IN_RANGE_QUERY } from '../../queries';

dayjs.extend(LocalizedFormat);
dayjs.extend(CustomParseFormat);

function EventForm(props) {
    const { isVisible, date, hideForm, range } = props;
    const [newTitle, setNewTitle] = useState('');
    const [eventType, setEventType] = useState(EventTypes.MEETING.id);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [createTimeBlock] = useCreateTimeBlock();
    const client = useApolloClient();

    const onSave = () => {
        createTimeBlock({
            variables: {
                title: newTitle,
                type: eventType,
                startDateTime: startTime.getTime(),
                endDateTime: endTime.getTime(),
                isAllDay: false,
            },
            update: (cache, { data }) => {
                const existingTimeBlocks = client.readQuery({
                    query: TIMEBLOCKS_IN_RANGE_QUERY,
                    variables: { start: range.start, end: range.end },
                });

                client.writeQuery({
                    query: TIMEBLOCKS_IN_RANGE_QUERY,
                    variables: { start: range.start, end: range.end },
                    data: {
                        getTimeBlocksInRange: [
                            ...existingTimeBlocks.getTimeBlocksInRange,
                            data.createTimeBlock,
                        ],
                    },
                });
            },
        });

        setNewTitle('');
        setEventType(EventTypes.MEETING.id);
        hideForm();
    };

    useDomEffect(
        'keydown',
        (e) => {
            if (!isVisible) {
                return;
            }

            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                e.preventDefault();
                onSave();
            }
        },
        [newTitle, eventType, startTime, endTime]
    );

    useEffect(() => {
        setStartTime(date);
        setEndTime(dayjs(date).add(1, 'hour').toDate());
    }, [date]);

    const onCancel = () => {
        setNewTitle('');
        setEventType(EventTypes.MEETING.id);
        hideForm();
    };

    const titleInput = useRef(null);
    useEffect(() => {
        titleInput.current?.focus();
    }, [isVisible]);

    const timeOptions = getTimeOptions(date);

    return (
        <Modal show={isVisible} onHide={hideForm}>
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
                <button className="btn-cancel" onClick={onCancel} type="button">
                    Cancel
                </button>
                <button className="btn-save" onClick={onSave} type="submit">
                    Save
                </button>
            </Modal.Body>
        </Modal>
    );
}

EventForm.propTypes = {
    isVisible: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
    hideForm: PropTypes.func,
};

EventForm.defaultProps = {
    isVisible: false,
    date: new Date(),
    hideForm: () => {},
};

export default EventForm;
