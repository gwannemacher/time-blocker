import { useMutation } from '@apollo/client';
import { DELETE_TIME_BLOCK_MUTATION } from '../queries';

const useDeleteTimeBlock = () => useMutation(DELETE_TIME_BLOCK_MUTATION);

export default useDeleteTimeBlock;
