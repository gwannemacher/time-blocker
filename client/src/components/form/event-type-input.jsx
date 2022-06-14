import React from 'react';
import PropTypes from 'prop-types';

import EventTypes from '../../models/event-types';

function EventTypeInput(props) {
    const { eventType, setEventType } = props;

    return (
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
            <option value={EventTypes.WORK.id}>{EventTypes.WORK.name}</option>
            <option value={EventTypes.PERSONAL.id}>
                {EventTypes.PERSONAL.name}
            </option>
            <option value={EventTypes.MISC.id}>{EventTypes.MISC.name}</option>
        </select>
    );
}

EventTypeInput.propTypes = {
    eventType: PropTypes.string,
    setEventType: PropTypes.func,
};

EventTypeInput.defaultProps = {
    eventType: '',
    setEventType: () => {},
};

export default EventTypeInput;
