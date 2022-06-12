import React, { useState, useEffect, useCallback } from 'react';
import { gql, useApolloClient, makeVar } from '@apollo/client';
import * as dayjs from 'dayjs';

import Calendar from './calendar';
import EventForm from './event-form/event-form';
import AllDayEventForm from './event-form/all-day-event-form';
import DeleteModal from './modals/delete-modal';
import EditModal from './modals/edit-modal';
import useUpdateTimeBlockTimes from '../hooks/useUpdateTimeBlockTimes';
import useGetTimeBlocksInRange from '../hooks/useGetTimeBlocks';
import useKeyboardEvents from '../hooks/useKeyboardEvents';

import '../stylesheets/calendar.css';

export const selectedVar = makeVar({ id: '', isSelected: false });

const getBlock = (timeBlocks: any[]) => {
    if (!selectedVar().id || !selectedVar().isSelected || !timeBlocks) {
        return null;
    }

    const filtered = timeBlocks.filter((x) => x.id === selectedVar().id);
    return filtered?.length === 0 ? null : filtered[0];
};

function CalendarApp() {
    const client = useApolloClient();
    const today = dayjs(new Date()).startOf('day');
    const [range, setRange] = useState({
        start: today.startOf('week').valueOf(),
        end: today.add(1, 'week').valueOf(),
    });
    const { data } = useGetTimeBlocksInRange(range.start, range.end);
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();
    const { copyEvent, moveEvent } = useKeyboardEvents(range);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAllDayFormVisible, setIsAllDayFormVisible] = useState(false);
    const [isDeleteFormVisible, setIsDeleteFormVisible] = useState(false);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleKeyDown = useCallback(
        (event) => {
            if (
                !selectedVar().id ||
                isFormVisible ||
                isAllDayFormVisible ||
                isDeleteFormVisible ||
                isEditFormVisible
            ) {
                return;
            }

            if (event.key === 'd' || event.key === 'Backspace') {
                setIsDeleteFormVisible(true);
            } else if (event.key === 'e') {
                setIsEditFormVisible(true);
            } else if (event.key === 'c') {
                copyEvent(getBlock(data?.getTimeBlocksInRange));
            } else if (event.key === 'm') {
                moveEvent(getBlock(data?.getTimeBlocksInRange));
            }
        },
        [
            selectedVar(),
            isFormVisible,
            isAllDayFormVisible,
            isDeleteFormVisible,
            isEditFormVisible,
        ]
    );

    useEffect(() => {
        document.addEventListener('keyup', handleKeyDown);
        return () => {
            document.removeEventListener('keyup', handleKeyDown);
        };
    }, [handleKeyDown]);

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

    return (
        <>
            <EventForm
                range={range}
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
                title={getBlock(data?.getTimeBlocksInRange)?.title}
                hideForm={() => setIsEditFormVisible(false)}
            />
            <Calendar
                timeBlocks={data?.getTimeBlocksInRange}
                onEventClick={onEventClick}
                onDateClick={onDateClick}
                onEventTimeChange={onEventTimeChange}
                setRange={setRange}
            />
        </>
    );
}

export default CalendarApp;
