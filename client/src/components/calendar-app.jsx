import React, { useState, useEffect } from 'react';
import { useApolloClient, makeVar } from '@apollo/client';
import * as dayjs from 'dayjs';

import Calendar from './calendar';
import EventForm from './event-form/event-form';
import AllDayEventForm from './event-form/all-day-event-form';
import DeleteModal from './modals/delete-modal';
import EditModal from './modals/edit-modal';
import useUpdateTimeBlockTimes from '../hooks/useUpdateTimeBlockTimes';
import useGetTimeBlocks from '../hooks/useGetTimeBlocks';
import useKeyboardEvents from '../hooks/useKeyboardEvents';

import '../stylesheets/calendar.css';

export const selectedVar = makeVar({ id: '', isSelected: false });

function CalendarApp() {
    const client = useApolloClient();
    const { data } = useGetTimeBlocks();
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAllDayFormVisible, setIsAllDayFormVisible] = useState(false);
    const [isDeleteFormVisible, setIsDeleteFormVisible] = useState(false);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const { copyEvent, moveEvent } = useKeyboardEvents();

    const getBlock = () => {
        if (
            !selectedVar().id ||
            !selectedVar().isSelected ||
            !data?.getTimeBlocks
        ) {
            return null;
        }

        const filtered = data.getTimeBlocks.filter(
            (x) => x.id === selectedVar().id
        );
        return filtered?.length === 0 ? null : filtered[0];
    };

    const handleKeyDown = (event) => {
        if (!selectedVar().id) {
            return;
        }

        if (
            isFormVisible ||
            isAllDayFormVisible ||
            isDeleteFormVisible ||
            isEditFormVisible
        ) {
            return;
        }

        if (event.key === 'd') {
            setIsDeleteFormVisible(true);
        } else if (event.key === 'e') {
            setIsEditFormVisible(true);
        } else if (event.key === 'c') {
            copyEvent(getBlock());
        } else if (event.key === 'm') {
            moveEvent(getBlock());
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', handleKeyDown);
        return () => {
            document.removeEventListener('keyup', handleKeyDown);
        };
    }, [selectedVar]);

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

    const onEventClick = (info) => {
        const { id } = info.event;

        if (selectedVar().id === id) {
            selectedVar({ id: '', isSelected: false });
        } else {
            selectedVar({ id, isSelected: true });
        }
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
                id,
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
                id={selectedVar()?.id}
                hideForm={() => setIsDeleteFormVisible(false)}
            />
            <EditModal
                isVisible={isEditFormVisible}
                id={selectedVar()?.id}
                title={getBlock()?.title}
                hideForm={() => setIsEditFormVisible(false)}
            />
            <Calendar
                timeBlocks={data?.getTimeBlocks}
                onEventClick={onEventClick}
                onDateClick={onDateClick}
                onEventTimeChange={onEventTimeChange}
            />
        </>
    );
}

export default CalendarApp;
