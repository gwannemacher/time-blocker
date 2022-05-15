import { useMutation } from '@apollo/client';
import { UPDATE_TIME_BLOCK_TIMES_MUTATION } from '../queries';

const useUpdateTimeBlockTimes = () =>
    useMutation(UPDATE_TIME_BLOCK_TIMES_MUTATION);

export default useUpdateTimeBlockTimes;
