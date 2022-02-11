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
        setIsFormVisible(true);
        setDate(info.date);
        setIsAllDay(info.allDay);
    };

    const eventClick = (info) => {
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

    const updateTimes = (start, end) => {
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

    const onEventResize = (info) => {
        updateTimes(info.event.start, info.event.end);
    };

    const onEventDrop = (info) => {
        client.cache.modify({
            id: `TimeBlock:${info.event.id}`,
                fields: {
                    startTime() {
                        return dayjs(info.event.start).format('HH:mm');
                    },
                    startDate() {
                        return dayjs(info.event.start).format('YYYY-MM-DD');
                    },
                    endTime() {
                        return dayjs(info.event.end).format('HH:mm');
                    },
                    endDate() {
                        return dayjs(info.event.end).format('YYYY-MM-DD');
                    }
            },
        });

        updateTimes(info.event.start, info.event.end);
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
                dateClick={onDateClick}
                events={data?.getTimeBlocks.map((x) => ({
                    start: `${x.startDate}T${x.startTime}`,
                    end: `${x.endDate}T${x.endTime}`,
                    title: EventTypes.displayTitle(x.type, x.title),
                    className: EventTypes.select(x.type)?.className,
                    id: x.id,
                    allDay: x.isAllDay,
                }))}
                eventClick={eventClick}
                editable
                eventResizableFromStart
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'narrow',
                }}
                eventMouseEnter={onEventHover}
                eventMouseLeave={onEventMouseLeave}
                snapDuration="00:15:00"
                eventResize={onEventResize}
                eventDrop={onEventDrop}
            />
        </>
    );
}

export default Calendar;
