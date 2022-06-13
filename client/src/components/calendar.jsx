import React, { useRef, useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as dayjs from 'dayjs';

import EventTypes from '../models/event-types';
import isPastEvent from '../utilities/time-utilities';
import useUpdateTimeBlockTimes from '../hooks/useUpdateTimeBlockTimes';

import '../stylesheets/calendar.css';

const rangeForThisWeek = () => {
    const today = dayjs(new Date()).startOf('day');
    return {
        start: today.startOf('week').valueOf(),
        end: today.add(1, 'week').valueOf(),
    };
};

const rangeForPreviousWeek = (calendarApi: any) => ({
    start: dayjs(calendarApi.view.activeStart).subtract(1, 'week').valueOf(),
    end: dayjs(calendarApi.view.activeEnd).subtract(1, 'week').valueOf(),
});

const rangeForNextWeek = (calendarApi: any) => ({
    start: dayjs(calendarApi.view.activeStart).add(1, 'week').valueOf(),
    end: dayjs(calendarApi.view.activeEnd).add(1, 'week').valueOf(),
});

function Calendar(props) {
    const { timeBlocks, onEventClick, onDateClick, setRange } = props;
    const client = useApolloClient();
    const calendarRef = useRef(null);
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();

    const onEventTimeChange = (info) => {
        const { id, start, end } = info.event;

        updateTimeBlockTimes({
            variables: {
                id,
                startDateTime: dayjs(start).valueOf(),
                endDateTime: dayjs(end).valueOf(),
            },
        });

        client.writeFragment({
            id: `TimeBlock:${id}`,
            fragment: gql`
                fragment UpdatedTimeBlock on TimeBlock {
                    startDateTime
                    endDateTime
                }
            `,
            data: {
                startDateTime: dayjs(start).valueOf(),
                endDateTime: dayjs(end).valueOf(),
            },
        });
    };

    useEffect(() => {
        const calendarApi = calendarRef.current.getApi();

        const setTimeRangeForPrevious = () => {
            const { start, end } = rangeForPreviousWeek(calendarApi);
            setRange({ start, end });
        };

        const setTimeRangeForNext = () => {
            const { start, end } = rangeForNextWeek(calendarApi);
            setRange({ start, end });
        };

        const setTimeRangeForThisWeek = () => {
            const { start, end } = rangeForThisWeek();
            setRange({ start, end });
        };

        document
            .querySelector('[title="Previous week"]')
            .addEventListener('click', setTimeRangeForPrevious);

        document
            .querySelector('[title="Next week"]')
            .addEventListener('click', setTimeRangeForNext);

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
