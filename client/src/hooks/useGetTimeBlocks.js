import { useQuery } from '@apollo/client';
import { TIMEBLOCKS_QUERY } from '../queries';

const useGetTimeBlocks = () => useQuery(TIMEBLOCKS_QUERY);

export default useGetTimeBlocks;
