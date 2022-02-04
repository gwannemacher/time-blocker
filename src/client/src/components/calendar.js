import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation, gql } from '@apollo/client';

import EventForm from './event-form/event-form.js';
import EventTypes from '../models/event-types.js';

import '../stylesheets/calendar.css';

export const TIMEBLOCKS_QUERY = gql`
    {
        getTimeBlocks {
            id
            title
            type
            startTime
            startDate
            endTime
            endDate
            isAllDay
        }
    }
`;

const DELETE_TIME_BLOCK_MUTATION = gql`
    mutation DeleteTimeBlock($id: String!) {
        deleteTimeBlock(id: $id) {
            id
        }
    }
`;

const Calendar = () => {
    const { data } = useQuery(TIMEBLOCKS_QUERY);
    const [ deleteTimeBlock ] = useMutation(DELETE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_QUERY],
    });

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [date, setDate] = useState({});
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
                <></>
            )}
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                nowIndicator={true}
                scrollTime="08:00:00"
                dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
                stickyHeaderDates={true}
                titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
                dateClick={onDateClick}
                events={data?.getTimeBlocks.map((x) => ({
                    start: `${x.startDate}T${x.startTime}`,
                    end: `${x.endDate}T${x.endTime}`,
                    title: EventTypes.displayTitle(x.type, x.title),
                    className: EventTypes.select(x.type)?.className,
                    id: x.id,
                }))}
                eventClick={eventClick}
                editable={true}
                eventResizableFromStart={true}
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'narrow',
                }}
            />
        </>
    );
};

export default Calendar;
