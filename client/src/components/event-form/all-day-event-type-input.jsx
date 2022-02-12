import React from 'react';
import PropTypes from 'prop-types';

import EventTypes from '../../models/event-types';

function AllDayEventTypeInput(props) {
    const { eventType, setEventType } = props;

    return (
        <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
        >
            <option value={EventTypes.ALLDAY_WORK.id}>
                {EventTypes.ALLDAY_WORK.name}
            </option>
            <option value={EventTypes.PERSONAL.id}>
                {EventTypes.PERSONAL.name}
            </option>
            <option value={EventTypes.MISC.id}>{EventTypes.MISC.name}</option>
        </select>
    );
}

AllDayEventTypeInput.propTypes = {
    eventType: PropTypes.string,
    setEventType: PropTypes.func,
};

AllDayEventTypeInput.defaultProps = {
    eventType: '',
    setEventType: () => {},
};

export default AllDayEventTypeInput;
