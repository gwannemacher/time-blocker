import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import * as dayjs from 'dayjs';

import EventForm from './event-form/event-form';
import AllDayEventForm from './event-form/all-day-event-form';
import EventTypes from '../models/event-types';
import {
    TIMEBLOCKS_QUERY,
    DELETE_TIME_BLOCK_MUTATION,
    CREATE_TIME_BLOCK_MUTATION,
    UPDATE_TIME_BLOCK_TITLE_MUTATION,
    UPDATE_TIME_BLOCK_TIMES_MUTATION,
} from '../queries';
import useDomEffect from '../utilities/dom-utilities';
import isPastEvent from '../utilities/time-utilities';

import '../stylesheets/calendar.css';

class HoveredEvent {
    start;

    end;

    id;

    title;

    type;

    isAllDay;
}

function Calendar() {
    const client = useApolloClient();
    const { data } = useQuery(TIMEBLOCKS_QUERY);
    const [deleteTimeBlock] = useMutation(DELETE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_QUERY],
    });
    const [updateTimeBlockName] = useMutation(UPDATE_TIME_BLOCK_TITLE_MUTATION);
    const [updateTimeBlockTimes] = useMutation(
        UPDATE_TIME_BLOCK_TIMES_MUTATION
    );
    const [createTimeBlock] = useMutation(CREATE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_QUERY],
    });

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAllDayFormVisible, setIsAllDayFormVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [hoveredEvent, setHoveredEvent] = useState(null);

    const deleteEvent = () => {
        if (window.confirm('Delete?')) {
            deleteTimeBlock({
                variables: { id: hoveredEvent.id },
            });
        }
    };

    const editEvent = () => {
        const newTitle = prompt('Please enter new title', hoveredEvent.title);

        if (newTitle) {
            updateTimeBlockName({
                variables: { id: hoveredEvent.id, title: newTitle },
            });
        }
    };

    const copyEvent = () => {
        if (!hoveredEvent) {
            return;
        }

        createTimeBlock({
            variables: {
                title: hoveredEvent.title,
                type: hoveredEvent.type,
                startTime: dayjs(hoveredEvent.start).format('HH:mm'),
                startDate: dayjs(hoveredEvent.start).format('YYYY-MM-DD'),
                endTime: dayjs(hoveredEvent.end).format('HH:mm'),
                endDate: dayjs(hoveredEvent.end).format('YYYY-MM-DD'),
                isAllDay: false,
            },
        });
    };

    const handleKeyDown = (event) => {
        if (!hoveredEvent || isFormVisible) {
            return;
        }

        if (event.key === 'd') {
            deleteEvent();
        } else if (event.key === 'e') {
            editEvent();
        } else if (event.key === 'c') {
            copyEvent();
        }
    };

    useDomEffect('keydown', handleKeyDown, [hoveredEvent]);

    useEffect(() => {
        setHoveredEvent(null);
    }, [data]);

    const onDateClick = (info) => {
        if (info.allDay) {
            setIsAllDayFormVisible(true);
        } else {
            setIsFormVisible(true);
        }

        if (info.date.getMinutes() === 15) {
            info.date.setMinutes(0);
        } else if (info.date.getMinutes() === 45) {
            info.date.setMinutes(30);
        }

        setDate(info.date);
    };

    const onEventClick = (info) => {
        if (window.confirm('Delete?')) {
            deleteTimeBlock({
                variables: { id: info.event.id },
            });
        }
    };

    const onEventHover = (info) => {
        if (!hoveredEvent) {
            const hovered = new HoveredEvent();
            hovered.id = info.event.id;
            hovered.title = info.event.extendedProps.title;
            hovered.type = info.event.extendedProps.type;
            hovered.start = info.event.start;
            hovered.end = info.event.end;
            hovered.isAllDay = info.event.isAllDay;
            setHoveredEvent(hovered);
        }
    };

    const onEventMouseLeave = (info) => {
        if (info.jsEvent.toElement?.className.includes('fc-event-title')) {
            // safari weirdness
            return;
        }

        setHoveredEvent(null);
    };

    const onEventTimeChange = (info) => {
        const { id, start, end } = info.event;

        client.cache.modify({
            id: `TimeBlock:${id}`,
            fields: {
                startTime() {
                    return dayjs(start).format('HH:mm');
                },
                startDate() {
                    return dayjs(start).format('YYYY-MM-DD');
                },
                endTime() {
                    return dayjs(end).format('HH:mm');
                },
                endDate() {
                    return dayjs(end).format('YYYY-MM-DD');
                },
            },
        });

        updateTimeBlockTimes({
            variables: {
                id: hoveredEvent.id,
                startTime: dayjs(start).format('HH:mm'),
                startDate: dayjs(start).format('YYYY-MM-DD'),
                endTime: dayjs(end).format('HH:mm'),
                endDate: dayjs(end).format('YYYY-MM-DD'),
            },
        });
    };

    return (
        <>
            {isFormVisible ? (
                <EventForm
                    date={date}
                    hideForm={() => setIsFormVisible(false)}
                />
            ) : (
                <div />
            )}
            {isAllDayFormVisible ? (
                <AllDayEventForm
                    date={date}
                    hideForm={() => setIsAllDayFormVisible(false)}
                />
            ) : (
                <div />
            )}
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                nowIndicator
                scrollTime="08:00:00"
                dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
                stickyHeaderDates
                titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
                events={data?.getTimeBlocks.map((x) => ({
                    start: `${x.startDate}T${x.startTime}`,
                    end: `${x.endDate}T${x.endTime}`,
                    title: x.prefixedTitle,
                    classNames: [
                        EventTypes.select(x.type)?.className,
                        isPastEvent(x.endDate, x.endTime) ? 'past-event' : '',
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
                eventMouseEnter={onEventHover}
                eventMouseLeave={onEventMouseLeave}
                eventResize={onEventTimeChange}
                eventDrop={onEventTimeChange}
            />
        </>
    );
}

export default Calendar;
