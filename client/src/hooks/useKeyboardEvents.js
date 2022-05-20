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
                    startTime: block.startTime,
                    startDate: block.startDate,
                    endTime: block.endTime,
                    endDate: block.endDate,
                    isAllDay: false,
                },
            });
        },

        moveEvent: (block: any) => {
            if (!block) {
                return;
            }

            const startDateTime = dayjs(
                `${block.startDate}T${block.startTime}:00`
            );
            const nextMondayStart = startDateTime.day(8);

            const endDateTime = dayjs(`${block.endDate}T${block.endTime}:00`);
            const nextMondayEnd = endDateTime.day(8);

            updateTimeBlockTimes({
                variables: {
                    id: block.id,
                    startTime: block.startTime,
                    startDate: nextMondayStart.format('YYYY-MM-DD'),
                    endTime: block.endTime,
                    endDate: nextMondayEnd.format('YYYY-MM-DD'),
                },
            });
        },
    };
};

export default useKeyboardEvents;
