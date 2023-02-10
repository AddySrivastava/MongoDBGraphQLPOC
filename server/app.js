const express = require('express');
const mongoose = require('mongoose');
const userProfileSC = require('./schemaComposer/userProfileSC');
const { ApolloServer } = require('apollo-server-express');


async function initApolloServer() {

    const connectionString = process.env.connectionString
    const graphQLPort = process.env.graphQLPort
    const app = express();
    try {
        await mongoose.connect(connectionString);
    } catch (err) {
        console.error(err);
    }

    const server = new ApolloServer({
        schema: userProfileSC
    });
    await server.start();

    server.applyMiddleware({ app });

    app.use((req, res) => {
        res.status(200);
        res.send('Hello!');
        res.end();
    });

    await new Promise(resolve => app.listen({ port: graphQLPort }, resolve));
    console.log(`🚀 Server ready at http://localhost:${graphQLPort}${server.graphqlPath}`);
}

initApolloServer();