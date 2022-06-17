import React, { useRef, useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as dayjs from 'dayjs';

import EventTypes from '../models/event-types';
import isPastEvent from '../utilities/time-utilities';
import useUpdateTimeBlockTimes from '../hooks/useUpdateTimeBlockTimes';

import '../stylesheets/calendar.css';

const rangeForToday = (calendarApi: any) => {
    const today = dayjs(new Date()).startOf('day');
    return {
        start:
            calendarApi.view.type === 'timeGridWeek'
                ? today.startOf('week').valueOf()
                : dayjs(today.startOf('month').valueOf())
                      .subtract(1, 'week')
                      .valueOf(),
        end:
            calendarApi.view.type === 'timeGridWeek'
                ? today.add(1, 'week').valueOf()
                : dayjs(today.startOf('month').valueOf())
                      .add(6, 'week')
                      .valueOf(),
    };
};

const rangeForMonth = (calendarApi: any) => {
    const day = dayjs(calendarApi.view.activeStart).startOf('month');

    return {
        start: dayjs(day).subtract(1, 'week').valueOf(),
        end: dayjs(day).add(6, 'week').valueOf(),
    };
};

const rangeForPrevious = (calendarApi: any) => ({
    start:
        calendarApi.view.type === 'timeGridWeek'
            ? dayjs(calendarApi.view.activeStart).subtract(1, 'week').valueOf()
            : dayjs(calendarApi.view.activeStart).subtract(6, 'week').valueOf(),
    end:
        calendarApi.view.type === 'timeGridWeek'
            ? dayjs(calendarApi.view.activeEnd).subtract(1, 'week').valueOf()
            : dayjs(calendarApi.view.activeEnd).subtract(4, 'week').valueOf(),
});

const rangeForNext = (calendarApi: any) => ({
    start:
        calendarApi.view.type === 'timeGridWeek'
            ? dayjs(calendarApi.view.activeStart).add(1, 'week').valueOf()
            : dayjs(calendarApi.view.activeStart).add(4, 'week').valueOf(),
    end:
        calendarApi.view.type === 'timeGridWeek'
            ? dayjs(calendarApi.view.activeEnd).add(1, 'week').valueOf()
            : dayjs(calendarApi.view.activeEnd).add(6, 'week').valueOf(),
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

        document
            .querySelector('.fc-prev-button')
            .addEventListener('click', () => {
                const { start, end } = rangeForPrevious(calendarApi);
                setRange({ start, end });
            });

        document
            .querySelector('.fc-next-button')
            .addEventListener('click', () => {
                const { start, end } = rangeForNext(calendarApi);
                setRange({ start, end });
            });

        document
            .querySelector('.fc-today-button')
            .addEventListener('click', () => {
                const { start, end } = rangeForToday(calendarApi);
                setRange({ start, end });
            });

        document
            .querySelector('.fc-dayGridMonth-button')
            .addEventListener('click', () => {
                const { start, end } = rangeForMonth(calendarApi);
                setRange({ start, end });
            });
    }, []);

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
                start: 'dayGridMonth,timeGridWeek',
                center: 'title',
                end: 'today prev,next',
            }}
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
