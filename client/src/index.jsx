import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client';

import './stylesheets/index.css';
import EventTypes from './models/event-types';
import CalendarApp, { selectedVar } from './components/calendar-app';

const httpLink = createHttpLink({
    // uri: 'http://localhost:5000/graphql',
    uri: 'https://gracula-time-blocker.herokuapp.com/graphql',
});

const cache = new InMemoryCache({
    typePolicies: {
        TimeBlock: {
            fields: {
                prefixedTitle: {
                    read(_, { readField }) {
                        const title = readField('title');
                        const type = readField('type');
                        return EventTypes.displayTitle(type, title);
                    },
                },
                isSelected: {
                    read(_, { readField }) {
                        const thisId = readField('id');
                        return (
                            selectedVar().id === thisId &&
                            selectedVar().isSelected
                        );
                    },
                },
                isPTO: {
                    read(_, { readField }) {
                        const title = readField('title');
                        return (
                            title.toLowerCase().includes('you day') ||
                            title.toLowerCase().includes('work holiday')
                        );
                    },
                },
            },
        },
    },
});

const client = new ApolloClient({
    link: httpLink,
    cache,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <CalendarApp />
        </ApolloProvider>
    </React.StrictMode>
);
