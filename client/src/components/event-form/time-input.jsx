import React from 'react';
import * as dayjs from 'dayjs';
import PropTypes from 'prop-types';

const toTimeString = (date) => dayjs(date).format('LT')?.toLowerCase()?.replace(/\s/g, '');

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
  for (let i = 0; i < 24; i += 1) {
    const [date0Minutes, date30Minutes] = [
      toTimeOption(newDate, i, 0),
      toTimeOption(newDate, i, 30),
    ];

    times.push(date0Minutes);
    times.push(date30Minutes);
  }

  return times;
};

function TimeInput(props) {
  const { time, setTime, options } = props;

  return (
    <select
      className="time-select"
      value={time}
      onChange={(e) => setTime(new Date(e.target.value))}
    >
      {options.map((t) => (
        <option key={t} value={t}>
          {toTimeString(t)}
        </option>
      ))}
    </select>
  );
}

TimeInput.propTypes = {
  time: PropTypes.string,
  setTime: PropTypes.func,
  options: PropTypes.shape([]),
};

TimeInput.defaultProps = {
  time: '',
  setTime: () => {},
  options: [],
};

export { getTimeOptions };
export default TimeInput;