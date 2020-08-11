import { ApolloServer, Config } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Express from 'express';
import * as path from 'path';
import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import MyContext from './interfaces/MyContext';
import { createSchema } from './utils/createSchema';
require('dotenv').config();

const main = async () => {
  const { TYPEORM_URL, TYPEORM_SYNCHRONIZE, TYPEORM_LOGGING } = process.env;
  if (TYPEORM_URL && TYPEORM_SYNCHRONIZE && TYPEORM_LOGGING) {
    const connectionOptions: ConnectionOptions = {
      type: 'mongodb',
      url: TYPEORM_URL,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      synchronize: JSON.parse(TYPEORM_SYNCHRONIZE),
      logging: JSON.parse(TYPEORM_LOGGING),
      entities: ['./src/entity/*.ts', './entity/*.js'],
    };
    try {
      await createConnection(connectionOptions);
    } catch (e) {
      console.log('db error', e);
    }
  }
  const apolloServerOptions: Config = {
    schema: await createSchema(),
    playground: true,
    context: ({ req, res }: MyContext) => ({ req, res }),
  };
  if (process.env.NODE_ENV === 'production') {
    apolloServerOptions.introspection = true;
  }
  const apolloServer = new ApolloServer(apolloServerOptions);
  const app = Express();
  app.use('/assets', Express.static(path.join(__dirname, 'assets')));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.get('/', (_, res) => {
    res.send('Working');
  });
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production'
          ? (process.env.FRONTEND_URL as string)
          : '*',
    })
  );
  const port = process.env.PORT || 8080;
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.listen(port, () => {
    console.log(`server is running on post ${port}`);
  });
};
main();
