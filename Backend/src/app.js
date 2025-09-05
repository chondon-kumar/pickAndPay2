import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
));

app.use(express.json({limit : '16kb'}));
app.use(express.urlencoded({ extended: true , limit : '16kb'}));
app.use('/public', express.static('public'))
app.use(cookieParser());

export {app}