import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress,graphiqlExpress } from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools'
import typeDefs from './schema'
import resolvers from './resolvers'
import models from './models'

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})
const PORT = 3000;
const app = express();


app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql',graphiqlExpress({endpointURL: '/graphql'}))

// we create the tables in the database 
models.sequelize.sync().then(() => {
	app.listen(PORT);
console.log(`server running on ${PORT}`)
})