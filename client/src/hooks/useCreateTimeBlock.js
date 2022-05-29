import { useMutation } from '@apollo/client';
import {
    TIMEBLOCKS_FOR_WEEK_QUERY,
    CREATE_TIME_BLOCK_MUTATION,
} from '../queries';

const useCreateTimeBlock = () =>
    useMutation(CREATE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_FOR_WEEK_QUERY],
    });

export default useCreateTimeBlock;
