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
                    startDateTime: block.startDateTime,
                    endDateTime: block.endDateTime,
                    isAllDay: false,
                },
                update: (cache, { data }) => {
                    cache.modify({
                        fields: {
                            getTimeBlocksInRange(existingTimeBlocks = []) {
                                return [
                                    ...existingTimeBlocks,
                                    data.createTimeBlock,
                                ];
                            },
                        },
                    });
                },
            });
        },

        moveEvent: (block: any) => {
            if (!block) {
                return;
            }

            const nextMondayStart = dayjs(block.startDateTime).day(8);
            const nextMondayEnd = dayjs(block.endDateTime).day(8);

            updateTimeBlockTimes({
                variables: {
                    id: block.id,
                    startDateTime: nextMondayStart.valueOf(),
                    endDateTime: nextMondayEnd.valueOf(),
                },
            });
        },
    };
};

export default useKeyboardEvents;
