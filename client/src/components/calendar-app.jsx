import React, { useState } from 'react';
import { makeVar } from '@apollo/client';
import * as dayjs from 'dayjs';

import Calendar from './calendar';
import Form from './form/form';
import useGetTimeBlocksInRange from '../hooks/useGetTimeBlocks';

import '../stylesheets/calendar.css';

export const selectedVar = makeVar({ id: '', isSelected: false });

function CalendarApp() {
    const today = dayjs(new Date()).startOf('day');
    const [range, setRange] = useState({
        start: today.startOf('week').valueOf(),
        end: today.add(1, 'week').valueOf(),
    });
    const { data } = useGetTimeBlocksInRange(range.start, range.end);
    const [selectedDateInfo, setSelectedDateInfo] = useState(null);

    const onDateClick = (info) => {
        setSelectedDateInfo(info);
    };

    const onEventClick = (info) => {
        const { id } = info.event;

        if (selectedVar().id === id) {
            selectedVar({ id: '', isSelected: false });
        } else {
            selectedVar({ id, isSelected: true });
        }
    };

    return (
        <>
            <Form
                timeBlocks={data?.getTimeBlocksInRange}
                selectedVar={selectedVar()}
                range={range}
                selectedDateInfo={selectedDateInfo}
            />
            <Calendar
                timeBlocks={data?.getTimeBlocksInRange}
                onEventClick={onEventClick}
                onDateClick={onDateClick}
                setRange={setRange}
            />
        </>
    );
}

export default CalendarApp;
