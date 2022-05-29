import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as dayjs from 'dayjs';

import EventTypes from '../models/event-types';
import isPastEvent from '../utilities/time-utilities';

import '../stylesheets/calendar.css';

function Calendar(props) {
    const {
        timeBlocks,
        onEventClick,
        onDateClick,
        onEventTimeChange,
        setStartRange,
        setEndRange,
    } = props;

    const calendarRef = useRef(null);

    useEffect(() => {
        const setTimeRangeForPrevious = () => {
            const calendarApi = calendarRef.current.getApi();
            const startRange = dayjs(calendarApi.view.activeStart).subtract(1, 'week');
            const endRange = dayjs(calendarApi.view.activeEnd).subtract(1, 'week');
            setStartRange(startRange.valueOf());
            setEndRange(endRange.valueOf());
        };

        document
            .querySelector('[title="Previous week"]')
            .addEventListener('click', setTimeRangeForPrevious);
    }, []);

    useEffect(() => {
        const setTimeRangeForNext = () => {
            const calendarApi = calendarRef.current.getApi();
            const startRange = dayjs(calendarApi.view.activeStart).add(1, 'week');
            const endRange = dayjs(calendarApi.view.activeEnd).add(1, 'week');
            setStartRange(startRange.valueOf());
            setEndRange(endRange.valueOf());
        };

        document
            .querySelector('[title="Next week"]')
            .addEventListener('click', setTimeRangeForNext);
    }, []);

    useEffect(() => {
        const setTimeRangeForThisWeek = () => {
            const today = dayjs(new Date()).startOf('day');
            setStartRange(today.startOf('week').valueOf());
            setEndRange(today.add(1, 'week').valueOf());
        };

        document
            .querySelector('[title="This week"]')
            .addEventListener('click', setTimeRangeForThisWeek);
    }, []);

    return (
        <FullCalendar
            ref={calendarRef}
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
