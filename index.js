import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import { graphqlExpress,graphiqlExpress } from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models'



const resolverType = fileLoader(path.join(__dirname, './resolvers'));

const resolvers = mergeResolvers(resolverType)

const types = fileLoader(path.join(__dirname, './schemas'));

const typeDefs =  mergeTypes(types);

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})
const PORT = 3000;
const app = express();

app.use(morgan('dev'))
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema , context: {
  models, // TODO: research
  user: {
    id: 1,
  }
}}));
app.use('/graphiql',graphiqlExpress({endpointURL: '/graphql'}))

// we create the tables in the database 
models.sequelize.sync().then(() => {
	app.listen(PORT);
console.log(`server running on ${PORT}`)
})