const express = require('express');
const mongoose = require('mongoose');
const userProfileSC = require('./schemaComposer/userProfileSC');
const { ApolloServer } = require('apollo-server-express');


async function initApolloServer() {
    const app = express();
    try {
        const MongoClient = await mongoose.connect("mongodb+srv://admin:passwordone@adityas-m10.4xwip.mongodb.net/?retryWrites=true&w=majority");
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

    await new Promise(resolve => app.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

initApolloServer();