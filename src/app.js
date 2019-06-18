/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import winston from 'winston';
import routes from './routes';
import traceLogger from './logger/traceLogger';

const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enable cors
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,x-auth,Accept,content-type,application/json'
  );
  next();
});

app.use(morgan('tiny'));
app.use(helmet());
app.use(compression());
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome' });
});

// routes
app.use('/api', routes);


// catch all unseen error
app.use('*', (req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
  next();
});

// development error handler
// will print stacktrace
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

// production error handler

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

process.on('unhandledRejection', (reason) => {
  traceLogger(reason);
});

process.on('uncaughtException', (reason) => {
  traceLogger(reason);
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  winston.info(`Connected to port ${PORT}`);
});

export default app;
