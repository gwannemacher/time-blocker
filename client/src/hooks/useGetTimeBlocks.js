import { useQuery } from '@apollo/client';
import { TIMEBLOCKS_IN_RANGE_QUERY } from '../queries';

const useGetTimeBlocksForWeek = (start: number, end: number) =>
    useQuery(TIMEBLOCKS_IN_RANGE_QUERY, { variables: { start, end } });

export default useGetTimeBlocksForWeek;
