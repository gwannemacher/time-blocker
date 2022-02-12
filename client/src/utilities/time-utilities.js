import * as dayjs from 'dayjs';

const isPastEvent = (endDate, endTime) =>
    dayjs(`${endDate}T${endTime}`).isBefore(new Date());

export default isPastEvent;
