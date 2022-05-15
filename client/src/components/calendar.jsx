import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useApolloClient } from '@apollo/client';
import * as dayjs from 'dayjs';

import EventForm from './event-form/event-form';
import AllDayEventForm from './event-form/all-day-event-form';
import EventTypes from '../models/event-types';
import { TIMEBLOCKS_QUERY } from '../queries';
import useDomEffect from '../utilities/dom-utilities';
import isPastEvent from '../utilities/time-utilities';
import HoveredEvent from '../models/hovered-event';
import DeleteModal from './modals/delete-modal';
import EditModal from './modals/edit-modal';
import useUpdateTimeBlockTimes from '../hooks/useUpdateTimeBlockTimes';
import useCreateTimeBlock from '../hooks/useCreateTimeBlock';

import '../stylesheets/calendar.css';

function Calendar() {
    const client = useApolloClient();
    const { data } = useQuery(TIMEBLOCKS_QUERY);
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();
    const [createTimeBlock] = useCreateTimeBlock();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAllDayFormVisible, setIsAllDayFormVisible] = useState(false);
    const [isDeleteFormVisible, setIsDeleteFormVisible] = useState(false);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [hoveredEvent, setHoveredEvent] = useState(null);

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

    const moveEvent = () => {
        if (!hoveredEvent) {
            return;
        }

        const nextMondayStart = dayjs(hoveredEvent.start).day(8);
        const nextMondayEnd = dayjs(hoveredEvent.end).day(8);

        updateTimeBlockTimes({
            variables: {
                id: hoveredEvent.id,
                startTime: dayjs(hoveredEvent.start).format('HH:mm'),
                startDate: nextMondayStart.format('YYYY-MM-DD'),
                endTime: dayjs(hoveredEvent.end).format('HH:mm'),
                endDate: nextMondayEnd.format('YYYY-MM-DD'),
            },
        });
    };

    const handleKeyDown = (event) => {
        if (!hoveredEvent) {
            return;
        }

        if (
            isFormVisible
            || isAllDayFormVisible
            || isDeleteFormVisible
            || isEditFormVisible
        ) {
            return;
        }

        if (event.key === 'd') {
            setIsDeleteFormVisible(true);
        } else if (event.key === 'e') {
            setIsEditFormVisible(true);
        } else if (event.key === 'c') {
            copyEvent();
        } else if (event.key === 'm') {
            moveEvent();
        }
    };

    useDomEffect('keyup', handleKeyDown, [hoveredEvent]);

    useEffect(() => {
        setHoveredEvent(null);
    }, [data]);

    const onDateClick = (info) => {
        setIsAllDayFormVisible(info.allDay);
        setIsFormVisible(!info.allDay);

        if (info.date.getMinutes() === 15) {
            info.date.setMinutes(0);
        } else if (info.date.getMinutes() === 45) {
            info.date.setMinutes(30);
        }

        setDate(info.date);
    };

    const onEventHover = (info) => {
        if (!hoveredEvent || hoveredEvent.id !== info.event.id) {
            const hovered: HoveredEvent = {
                id: info.event.id,
                title: info.event.extendedProps.title,
                type: info.event.extendedProps.type,
                start: info.event.start,
                end: info.event.end,
                isAllDay: info.event.isAllDay,
            };

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
            <EventForm
                isVisible={isFormVisible}
                date={date}
                hideForm={() => setIsFormVisible(false)}
            />
            <AllDayEventForm
                isVisible={isAllDayFormVisible}
                date={date}
                hideForm={() => setIsAllDayFormVisible(false)}
            />
            <DeleteModal
                isVisible={isDeleteFormVisible}
                id={hoveredEvent?.id}
                hideForm={() => setIsDeleteFormVisible(false)}
            />
            <EditModal
                isVisible={isEditFormVisible}
                id={hoveredEvent?.id}
                title={hoveredEvent?.title}
                hideForm={() => setIsEditFormVisible(false)}
            />
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
                eventClick={() => setIsDeleteFormVisible(true)}
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
