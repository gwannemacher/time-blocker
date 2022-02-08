import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation } from '@apollo/client';

import EventForm from './event-form/event-form';
import EventTypes from '../models/event-types';
import { TIMEBLOCKS_QUERY, DELETE_TIME_BLOCK_MUTATION } from '../queries';

import '../stylesheets/calendar.css';

function Calendar() {
    const { data } = useQuery(TIMEBLOCKS_QUERY);
    const [deleteTimeBlock] = useMutation(DELETE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_QUERY],
    });

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isAllDay, setIsAllDay] = useState(false);

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
            />
        </>
    );
}

export default Calendar;
