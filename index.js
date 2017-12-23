import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'
import path from 'path';
import cors from 'cors'
import morgan from 'morgan';
import { graphqlExpress,graphiqlExpress } from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { refreshTokens } from './auth'
import models from './models'

const SECRET = 'my-secret' // pass it in the context 
const SECRET2 = 'my-secret-2'

const resolverType = fileLoader(path.join(__dirname, './resolvers'));

const resolvers = mergeResolvers(resolverType)

const types = fileLoader(path.join(__dirname, './schemas'));

const typeDefs =  mergeTypes(types);

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})
const PORT = 5000;
const app = express();

app.use(cors('*'))

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET, SECRET2);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser)
app.use(morgan('dev'))
app.use('/graphql', bodyParser.json(), graphqlExpress(req => (
  { schema , context: {
  models, // TODO: research
  user: req.user,
  SECRET,
  SECRET2,
}}
)));
app.use('/graphiql',graphiqlExpress({endpointURL: '/graphql'}))

// we create the tables in the database 
models.sequelize.sync().then(() => {
	app.listen(PORT);
console.log(`server running on ${PORT}`)
})