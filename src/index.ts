import bodyParser from 'body-parser';
import cors from 'cors';
import Express from 'express';
import http from 'http';
import * as path from 'path';
import 'reflect-metadata';
import socketIO from 'socket.io';
import { ConnectionOptions, createConnection } from 'typeorm';
import StartIO from './services/StartIO';
require('dotenv').config();

const main = async () => {
  const {
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
    TYPEORM_SYNCHRONIZE,
    TYPEORM_LOGGING,
  } = process.env;
  if (
    TYPEORM_HOST &&
    TYPEORM_PORT &&
    TYPEORM_USERNAME &&
    TYPEORM_PASSWORD &&
    TYPEORM_PASSWORD &&
    TYPEORM_DATABASE &&
    TYPEORM_SYNCHRONIZE &&
    TYPEORM_LOGGING
  ) {
    const connectionOptions: ConnectionOptions = {
      type: 'mysql',
      host: TYPEORM_HOST,
      port: parseInt(TYPEORM_PORT),
      username: TYPEORM_USERNAME,
      password: TYPEORM_PASSWORD,
      database: TYPEORM_DATABASE,
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
  // const apolloServerOptions: Config = {
  //   schema: await createSchema(),
  //   playground: true,
  //   context: ({ req, res }: MyContext) => ({ req, res }),
  // };
  // if (process.env.NODE_ENV === 'production') {
  //   apolloServerOptions.introspection = true;
  // }
  // const apolloServer = new ApolloServer(apolloServerOptions);
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
  // apolloServer.applyMiddleware({
  //   app,
  //   cors: false,
  // });
  const server = http.createServer(app);
  const io = socketIO(server);
  new StartIO(io);
  server.listen(port, () => {
    console.log(`server is running on post ${port}`);
  });
};
main();
