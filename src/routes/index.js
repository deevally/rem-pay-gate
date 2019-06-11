import express from 'express';
import paymentRoute from './payment';

const app = express();

app.use('/', paymentRoute);

export default app;
