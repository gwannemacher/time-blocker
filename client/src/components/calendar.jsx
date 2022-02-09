import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation } from '@apollo/client';

import EventForm from './event-form/event-form';
import EventTypes from '../models/event-types';
import {
    TIMEBLOCKS_QUERY,
    DELETE_TIME_BLOCK_MUTATION,
    UPDATE_TIME_BLOCK_TITLE_MUTATION,
} from '../queries';
import useDomKeydownListenerEffect from '../dom-utilities';

import '../stylesheets/calendar.css';

function Calendar() {
    const { data } = useQuery(TIMEBLOCKS_QUERY);
    const [deleteTimeBlock] = useMutation(DELETE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_QUERY],
    });
    const [updateTimeBlockName] = useMutation(
        UPDATE_TIME_BLOCK_TITLE_MUTATION,
        {
            refetchQueries: [TIMEBLOCKS_QUERY],
        }
    );

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

    useDomKeydownListenerEffect(handleKeyDown, [
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
        if (info.jsEvent.toElement.className.includes('fc-event-title')) {
            // safari weirdness
            return;
        }

        setHoveredEvent('');
        setHoveredEventTitle('');
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
            />
        </>
    );
}

export default Calendar;
