import { useQuery } from '@apollo/client';
import { TIMEBLOCKS_FOR_WEEK_QUERY } from '../queries';

const useGetTimeBlocksForWeek = (currentDay: number) =>
    useQuery(TIMEBLOCKS_FOR_WEEK_QUERY, { variables: { currentDay } });

export default useGetTimeBlocksForWeek;
