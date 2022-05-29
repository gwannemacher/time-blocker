import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as dayjs from 'dayjs';

import EventTypes from '../models/event-types';
import isPastEvent from '../utilities/time-utilities';

import '../stylesheets/calendar.css';

function Calendar(props) {
    const { timeBlocks, onEventClick, onDateClick, onEventTimeChange } = props;

    return (
        <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            nowIndicator
            scrollTime="08:00:00"
            dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
            stickyHeaderDates
            titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
            events={timeBlocks?.map((x) => ({
                start: dayjs(x.startDateTime).toISOString(),
                end: dayjs(x.endDateTime).toISOString(),
                title: x.prefixedTitle,
                classNames: [
                    EventTypes.select(x.type)?.className,
                    isPastEvent(x.endDate, x.endTime) ? 'past-event' : '',
                    x.title === 'tbd' ? 'tbd-highlight' : '',
                    x.isSelected ? 'event-selected' : '',
                ],
                id: x.id,
                allDay: x.isAllDay,
                extendedProps: { title: x.title, type: x.type },
            }))}
            editable
            eventResizableFromStart
            eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'narrow',
            }}
            snapDuration="00:15:00"
            eventClick={onEventClick}
            dateClick={onDateClick}
            eventResize={onEventTimeChange}
            eventDrop={onEventTimeChange}
        />
    );
}

export default Calendar;
