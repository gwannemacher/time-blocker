import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const toCalendarEvent = (date, title) => {
    const [year, month, day, hours] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];

    const start = new Date(year, month, day, hours);
    const end = new Date(year, month, day, hours + 1);

    return {
        title,
        start,
        end
    }
}

const toAllDayCalendarEvent = (date, title) => {
    const [year, month, day, hours] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];
    const start = new Date(year, month, day, hours);

    return {
        title,
        start,
        allDay: true
    }
}

const dateClick = (info) => {
    const title = prompt("Time block title", "le time block");
    if (!title) {
        return;
    }

    const newEvent = info.allDay
        ? toAllDayCalendarEvent(info.date, title)
        : toCalendarEvent(info.date, title);

    info.view.calendar.addEvent(newEvent);
}

const eventClick = (info) => {
    if (window.confirm("Delete?")) {
        info.event.remove();
    }
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
            eventClick={eventClick}
            editable={true}
            eventResizableFromStart={true}
            eventTimeFormat={{hour: 'numeric', minute: '2-digit', meridiem: 'narrow'}}
        />
    );
}

export default Calendar;