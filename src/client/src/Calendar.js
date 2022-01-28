import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const toCalendarDate = (date, isEnd) => {
    const [year, month, day, hours] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];

    return isEnd
        ? new Date(year, month, day, hours + 1)
        : new Date(year, month, day, hours);
}

const dateClick = (info) => {
    const start = toCalendarDate(info.date);
    const end = toCalendarDate(info.date, true);
    const newEvent = {
        title: `${start.toLocaleTimeString()} event`,
        start,
        end
    }

    info.view.calendar.addEvent(newEvent);
}

const Calendar = () => {
    const [events, setEvents] = useState([]);

    return (
        <FullCalendar
            plugins={[ timeGridPlugin, interactionPlugin ]}
            initialView="timeGridWeek"
            nowIndicator={true}
            scrollTime="07:00:00"
            dayHeaderFormat={{weekday: 'short', day: 'numeric'}}
            dateClick={dateClick}
            events={events}
        />
    );
}

export default Calendar;