import express from 'express';
import cors from  'cors';
import config from './src/config/index';
import morgan from 'morgan';
import bodyParser from 'body-parser'
import routes from './src/routes/index';

const app = express();

const { PORT } = config;

app.use(morgan('tiny'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//enable ncors
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,x-auth,Accept,content-type,application/json"
  );
  next();
});

app.get('/', (req, res)=>{
    res.json({message:'Welcome'})
});

app.use("/api", routes);

//setup a default catch all routes
app.use('*', (req, res, next)=>{
    res.status(404).json({message:'route not found'});
    next();
});
app.listen(PORT,()=>{
    console.log(`Connected to port ${PORT}`)
});

export default app;
