import { useMutation } from '@apollo/client';
import { UPDATE_TIME_BLOCK_TITLE_MUTATION } from '../queries';

const useUpdateTimeBlockTitle = () =>
    useMutation(UPDATE_TIME_BLOCK_TITLE_MUTATION);

export default useUpdateTimeBlockTitle;
