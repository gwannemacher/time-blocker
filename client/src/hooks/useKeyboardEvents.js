import * as dayjs from 'dayjs';

import useUpdateTimeBlockTimes from './useUpdateTimeBlockTimes';
import useCreateTimeBlock from './useCreateTimeBlock';

const useKeyboardEvents = () => {
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();
    const [createTimeBlock] = useCreateTimeBlock();

    return {
        copyEvent: (block: any) => {
            if (!block) {
                return;
            }

            createTimeBlock({
                variables: {
                    title: block.title,
                    type: block.type,
                    startTime: dayjs(block.start).format('HH:mm'),
                    startDate: dayjs(block.start).format('YYYY-MM-DD'),
                    endTime: dayjs(block.end).format('HH:mm'),
                    endDate: dayjs(block.end).format('YYYY-MM-DD'),
                    isAllDay: false,
                },
            });
        },

        moveEvent: (block: any) => {
            if (!block) {
                return;
            }

            const nextMondayStart = dayjs(block.start).day(8);
            const nextMondayEnd = dayjs(block.end).day(8);

            updateTimeBlockTimes({
                variables: {
                    id: block.id,
                    startTime: dayjs(block.start).format('HH:mm'),
                    startDate: nextMondayStart.format('YYYY-MM-DD'),
                    endTime: dayjs(block.end).format('HH:mm'),
                    endDate: nextMondayEnd.format('YYYY-MM-DD'),
                },
            });
        },
    };
};

export default useKeyboardEvents;
