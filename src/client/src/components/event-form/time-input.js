import * as dayjs from 'dayjs';

const toTimeString = (date) => {
    return dayjs(date).format('LT')?.toLowerCase()?.replace(/\s/g, '');
};

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

const TimeInput = (props) => {
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
};

export { getTimeOptions };
export default TimeInput;
