import express from 'express';
import payment from './payment';

const app = express();

app.use('/', payment);

export default app;
