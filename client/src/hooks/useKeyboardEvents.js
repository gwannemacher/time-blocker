import * as dayjs from 'dayjs';

import useUpdateTimeBlockTimes from './useUpdateTimeBlockTimes';
import useCreateTimeBlock from './useCreateTimeBlock';

const useKeyboardEvents = (hoveredEvent: any) => {
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();
    const [createTimeBlock] = useCreateTimeBlock();

    return {
        copyEvent: () => {
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
        },

        moveEvent: () => {
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
        }
    };
};

export default useKeyboardEvents;
