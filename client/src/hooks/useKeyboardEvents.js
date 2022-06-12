import * as dayjs from 'dayjs';
import { useApolloClient } from '@apollo/client';

import useUpdateTimeBlockTimes from './useUpdateTimeBlockTimes';
import useCreateTimeBlock from './useCreateTimeBlock';
import { TIMEBLOCKS_IN_RANGE_QUERY } from '../queries';

const useKeyboardEvents = (range) => {
    const [updateTimeBlockTimes] = useUpdateTimeBlockTimes();
    const [createTimeBlock] = useCreateTimeBlock();
    const client = useApolloClient();

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
                    const existingTimeBlocks = client.readQuery({
                        query: TIMEBLOCKS_IN_RANGE_QUERY,
                        variables: { start: range.start, end: range.end },
                    });

                    client.writeQuery({
                        query: TIMEBLOCKS_IN_RANGE_QUERY,
                        variables: { start: range.start, end: range.end },
                        data: {
                            getTimeBlocksInRange: [
                                ...existingTimeBlocks.getTimeBlocksInRange,
                                data.createTimeBlock,
                            ],
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
