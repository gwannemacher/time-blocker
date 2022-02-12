import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
    useQuery, useMutation, useApolloClient
 } from '@apollo/client';
import * as dayjs from 'dayjs';

import EventForm from './event-form/event-form';
import EventTypes from '../models/event-types';
import {
    TIMEBLOCKS_QUERY,
    DELETE_TIME_BLOCK_MUTATION,
    UPDATE_TIME_BLOCK_TITLE_MUTATION,
    UPDATE_TIME_BLOCK_TIMES_MUTATION,
} from '../queries';
import useDomEffect from '../dom-utilities';

import '../stylesheets/calendar.css';

function Calendar() {
    const client = useApolloClient();
    const { data } = useQuery(TIMEBLOCKS_QUERY);
    const [deleteTimeBlock] = useMutation(DELETE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_QUERY],
    });
    const [updateTimeBlockName] = useMutation(UPDATE_TIME_BLOCK_TITLE_MUTATION);
    const [updateTimeBlockTimes] = useMutation(UPDATE_TIME_BLOCK_TIMES_MUTATION);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isAllDay, setIsAllDay] = useState(false);
    const [hoveredEvent, setHoveredEvent] = useState('');
    const [hoveredEventTitle, setHoveredEventTitle] = useState('');

    const deleteEvent = () => {
        if (window.confirm('Delete?')) {
            deleteTimeBlock({
                variables: { id: hoveredEvent },
            });
        }
    };

    const editEvent = () => {
        const newTitle = prompt('Please enter new title', hoveredEventTitle);
        if (newTitle) {
            updateTimeBlockName({
                variables: { id: hoveredEvent, title: newTitle },
            });
        }
    };

    const handleKeyDown = (event) => {
        if (!hoveredEvent || isFormVisible) {
            return;
        }

        if (event.key === 'd') {
            deleteEvent();
        } else if (event.key === 'e') {
            editEvent();
        }
    };

    useDomEffect('keydown', handleKeyDown, [
        hoveredEvent,
        hoveredEventTitle,
    ]);

    useEffect(() => {
        setHoveredEvent('');
        setHoveredEventTitle('');
    }, [data]);

    const onDateClick = (info) => {
        if (info.date.getMinutes() === 15) {
            info.date.setMinutes(0);
        } else if (info.date.getMinutes() === 45) {
            info.date.setMinutes(30);
        }

        setDate(info.date);
        setIsFormVisible(true);
        setIsAllDay(info.allDay);
    };

    const onEventClick = (info) => {
        if (window.confirm('Delete?')) {
            deleteTimeBlock({
                variables: { id: info.event.id },
            });
        }
    };

    const onEventHover = (info) => {
        setHoveredEvent(info.event.id);
        setHoveredEventTitle(EventTypes.removePrefix(info.event.title));
    };

    const onEventMouseLeave = (info) => {
        if (info.jsEvent.toElement?.className.includes('fc-event-title')) {
            // safari weirdness
            return;
        }

        setHoveredEvent('');
        setHoveredEventTitle('');
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
                }
            },
        });

        updateTimeBlockTimes({
            variables: {
                id: hoveredEvent,
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
                    isAllDay={isAllDay}
                    date={date}
                    hideForm={() => setIsFormVisible(false)}
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
                    title: EventTypes.displayTitle(x.type, x.title),
                    className: EventTypes.select(x.type)?.className,
                    id: x.id,
                    allDay: x.isAllDay,
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
