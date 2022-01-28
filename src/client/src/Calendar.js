import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const toCalendarEvent = (date) => {
    const [year, month, day, hours] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];

    const start = new Date(year, month, day, hours);
    const end = new Date(year, month, day, hours + 1);

    return {
        title: `${start.toLocaleTimeString()} event`,
        start,
        end
    }
}

const toAllDayCalendarEvent = (date) => {
    const [year, month, day, hours] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];
    const start = new Date(year, month, day, hours);

    return {
        title: `all day event`,
        start,
        allDay: true
    }
}

const dateClick = (info) => {
    const newEvent = info.allDay
        ? toAllDayCalendarEvent(info.date)
        : toCalendarEvent(info.date);

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