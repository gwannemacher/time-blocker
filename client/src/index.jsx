import React from 'react';
import ReactDOM from 'react-dom';
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client';

import './stylesheets/index.css';
import App from './App';

const httpLink = createHttpLink({
    // uri: 'http://localhost:5000/graphql',
    uri: 'https://gracula-time-blocker.herokuapp.com/graphql',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
