import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { useApolloClient } from '@apollo/client';

import EventTypes from '../../models/event-types';
import TitleInput from './title-input';
import AllDayEventTypeInput from './all-day-event-type-input';
import '../../stylesheets/modal.css';
import useCreateTimeBlock from '../../hooks/useCreateTimeBlock';
import useDomEffect from '../../hooks/useDomEffect';
import { TIMEBLOCKS_IN_RANGE_QUERY } from '../../queries';

dayjs.extend(LocalizedFormat);
dayjs.extend(CustomParseFormat);

function CreateAllDayForm(props) {
    const client = useApolloClient();

    const { isVisible, range, date, hideForm } = props;
    const [newTitle, setNewTitle] = useState('');
    const [eventType, setEventType] = useState(EventTypes.MEETING.id);
    const [createTimeBlock] = useCreateTimeBlock();

    const onSave = () => {
        createTimeBlock({
            variables: {
                title: newTitle,
                type: eventType,
                startDateTime: dayjs(date.getTime())
                    .hour(0)
                    .minute(0)
                    .valueOf(),
                endDateTime: dayjs(date.getTime()).hour(0).minute(0).valueOf(),
                isAllDay: true,
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
        [newTitle, eventType]
    );

    const onCancel = () => {
        setNewTitle('');
        setEventType(EventTypes.MEETING.id);
        hideForm();
    };

    const titleInput = useRef(null);
    useEffect(() => {
        titleInput.current?.focus();
    }, [isVisible]);

    return (
        <Modal show={isVisible} onHide={hideForm}>
            <Modal.Header closeButton />
            <Modal.Body>
                <TitleInput
                    titleInput={titleInput}
                    newTitle={newTitle}
                    setTitle={setNewTitle}
                />
                <AllDayEventTypeInput
                    eventType={eventType}
                    setEventType={setEventType}
                />
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

CreateAllDayForm.propTypes = {
    isVisible: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
    hideForm: PropTypes.func,
};

CreateAllDayForm.defaultProps = {
    isVisible: false,
    date: new Date(),
    hideForm: () => {},
};

export default CreateAllDayForm;
