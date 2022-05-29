import { gql } from '@apollo/client';

export const TIMEBLOCKS_IN_RANGE_QUERY = gql`
    query GetTimeBlocksInRange($start: Float!, $end: Float!) {
        getTimeBlocksInRange(start: $start, end: $end) {
            id
            title
            type
            startDateTime
            endDateTime
            isAllDay
            prefixedTitle @client
            isSelected @client
        }
    }
`;

export const DELETE_TIME_BLOCK_MUTATION = gql`
    mutation DeleteTimeBlock($id: String!) {
        deleteTimeBlock(id: $id)
    }
`;

export const UPDATE_TIME_BLOCK_TITLE_MUTATION = gql`
    mutation UpdateTimeBlockTitle($id: String!, $title: String!) {
        updateTimeBlockTitle(id: $id, title: $title) {
            id
            title
        }
    }
`;

export const UPDATE_TIME_BLOCK_TIMES_MUTATION = gql`
    mutation UpdateTimeBlockTimes(
        $id: String!
        $startDateTime: Float!
        $endDateTime: Float!
    ) {
        updateTimeBlockTimes(
            id: $id
            startDateTime: $startDateTime
            endDateTime: $endDateTime
        ) {
            id
            startDateTime
            endDateTime
        }
    }
`;

export const CREATE_TIME_BLOCK_MUTATION = gql`
    mutation CreateTimeBlock(
        $title: String!
        $type: String!
        $startDateTime: Float!
        $endDateTime: Float!
        $isAllDay: Boolean!
    ) {
        createTimeBlock(
            title: $title
            type: $type
            startDateTime: $startDateTime
            endDateTime: $endDateTime
            isAllDay: $isAllDay
        ) {
            id
        }
    }
`;
