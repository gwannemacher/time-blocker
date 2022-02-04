import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, gql } from '@apollo/client';

import EventForm from './event-form/event-form.js';
import EventTypes from '../models/event-types.js';

import '../stylesheets/calendar.css';

export const TIMEBLOCKS_QUERY = gql`
    {
        getTimeBlocks {
            id
            title
            type
            startTime
            startDate
            endTime
            endDate
            isAllDay
        }
    }
`;

const eventClick = (info) => {
    if (window.confirm('Delete?')) {
        info.event.remove();
    }
};

const Calendar = () => {
    const { data } = useQuery(TIMEBLOCKS_QUERY);

    console.log(data?.getTimeBlocks);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [date, setDate] = useState({});
    const [isAllDay, setIsAllDay] = useState(false);
    const [calendar, setCalendar] = useState({});

    const onDateClick = (info) => {
        setIsFormVisible(true);
        setDate(info.date);
        setIsAllDay(info.allDay);
        setCalendar(info.view.calendar);
    };

    return (
        <>
            {isFormVisible ? (
                <EventForm
                    isAllDay={isAllDay}
                    date={date}
                    addEvent={(e) => calendar.addEvent(e)}
                    hideForm={() => setIsFormVisible(false)}
                />
            ) : (
                <></>
            )}
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                nowIndicator={true}
                scrollTime="08:00:00"
                dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
                stickyHeaderDates={true}
                titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
                dateClick={onDateClick}
                events={data?.getTimeBlocks.map((x) => ({
                    start: `${x.startDate}T${x.startTime}`,
                    end: `${x.endDate}T${x.endTime}`,
                    title: x.title,
                    className: EventTypes.select(x.type)?.className
                }))}
                eventClick={eventClick}
                editable={true}
                eventResizableFromStart={true}
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'narrow',
                }}
            />
        </>
    );
};

export default Calendar;
