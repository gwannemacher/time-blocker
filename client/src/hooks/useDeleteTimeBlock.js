import { useMutation } from '@apollo/client';
import { TIMEBLOCKS_QUERY, DELETE_TIME_BLOCK_MUTATION } from '../queries';

const useDeleteTimeBlock = () =>
    useMutation(DELETE_TIME_BLOCK_MUTATION, {
            refetchQueries: [TIMEBLOCKS_QUERY],
        });

export default useDeleteTimeBlock;
