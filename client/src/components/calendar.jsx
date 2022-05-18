import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import HoveredEvent from '../models/hovered-event';
import EventTypes from '../models/event-types';
import isPastEvent from '../utilities/time-utilities';

import '../stylesheets/calendar.css';

function Calendar(props) {
    const {
        timeBlocks,
        showDeleteForm,
        onDateClick,
        setHoveredEvent,
        onEventTimeChange,
    } = props;

    const onEventHover = (info) => {
        const hovered: HoveredEvent = {
            id: info.event.id,
            title: info.event.extendedProps.title,
            type: info.event.extendedProps.type,
            start: info.event.start,
            end: info.event.end,
            isAllDay: info.event.isAllDay,
        };

        setHoveredEvent((previous) =>
            (!previous || previous.id !== hovered.id)
                ? hovered
                : previous
        );
    };

    const onEventMouseLeave = (info) => {
        if (info.jsEvent.toElement?.className.includes('fc-event-title')) {
            // safari weirdness
            return;
        }

        setHoveredEvent(null);
    };

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
                start: `${x.startDate}T${x.startTime}`,
                end: `${x.endDate}T${x.endTime}`,
                title: x.prefixedTitle,
                classNames: [
                    EventTypes.select(x.type)?.className,
                    isPastEvent(x.endDate, x.endTime) ? 'past-event' : '',
                    x.title === 'tbd' ? 'tbd-highlight' : '',
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
            eventClick={showDeleteForm}
            dateClick={onDateClick}
            eventMouseEnter={onEventHover}
            eventMouseLeave={onEventMouseLeave}
            eventResize={onEventTimeChange}
            eventDrop={onEventTimeChange}
        />
    );
}

export default Calendar;
