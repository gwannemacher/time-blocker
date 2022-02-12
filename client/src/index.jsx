import React from 'react';
import ReactDOM from 'react-dom';
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client';

import './stylesheets/index.css';
import EventTypes from './models/event-types';
import App from './App';

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
            }
        },
      },
    },
  },
});

const client = new ApolloClient({
    link: httpLink,
    cache
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
