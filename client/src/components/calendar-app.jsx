import React, { useState } from 'react';
import { gql, useApolloClient, makeVar } from '@apollo/client';
import * as dayjs from 'dayjs';

import Calendar from './calendar';
import Form from './event-form/form';
import useUpdateTimeBlockTimes from '../hooks/useUpdateTimeBlockTimes';
import useGetTimeBlocksInRange from '../hooks/useGetTimeBlocks';

import '../stylesheets/calendar.css';

export const selectedVar = makeVar({ id: '', isSelected: false });

function CalendarApp() {
    const client = useApolloClient();
    const today = dayjs(new Date()).startOf('day');
    const [range, setRange] = useState({
        start: today.startOf('week').valueOf(),
        end: today.add(1, 'week').valueOf(),
    });
    const { data } = useGetTimeBlocksInRange(range.start, range.end);
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();
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
                onEventTimeChange={onEventTimeChange}
                setRange={setRange}
            />
        </>
    );
}

export default CalendarApp;
