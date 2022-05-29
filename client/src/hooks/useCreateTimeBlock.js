import { useMutation } from '@apollo/client';
import { CREATE_TIME_BLOCK_MUTATION } from '../queries';

const useCreateTimeBlock = () => useMutation(CREATE_TIME_BLOCK_MUTATION);

export default useCreateTimeBlock;
