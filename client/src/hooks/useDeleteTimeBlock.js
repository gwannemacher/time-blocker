import { useMutation } from '@apollo/client';
import {
    TIMEBLOCKS_FOR_WEEK_QUERY,
    DELETE_TIME_BLOCK_MUTATION,
} from '../queries';

const useDeleteTimeBlock = () =>
    useMutation(DELETE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_FOR_WEEK_QUERY],
    });

export default useDeleteTimeBlock;
