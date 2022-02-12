import { gql } from '@apollo/client';

export const TIMEBLOCKS_QUERY = gql`
    {
        getTimeBlocks {
            id
            title
            type
            startTime
            startDate
            endTime
            endDate
            isAllDay
            prefixedTitle @client
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
        updateTimeBlockTitle(id: $id, title: $title) { id, title }
    }
`;

export const UPDATE_TIME_BLOCK_TIMES_MUTATION = gql`
    mutation UpdateTimeBlockTimes($id: String!, $startTime: String!, $startDate: String!, $endTime: String!, $endDate: String!) {
        updateTimeBlockTimes(id: $id, startTime: $startTime, startDate: $startDate, endTime: $endTime, endDate: $endDate) { id, startTime, startDate, endTime, endDate }
    }
`;

export const CREATE_TIME_BLOCK_MUTATION = gql`
    mutation CreateTimeBlock(
        $title: String!
        $type: String!
        $startTime: String!
        $startDate: String!
        $endTime: String!
        $endDate: String!
        $isAllDay: Boolean!
    ) {
        createTimeBlock(
            title: $title
            type: $type
            startTime: $startTime
            startDate: $startDate
            endTime: $endTime
            endDate: $endDate
            isAllDay: $isAllDay
        ) {
            id
        }
    }
`;
