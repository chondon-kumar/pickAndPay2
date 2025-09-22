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

// route import
import { userRouter } from './routes/user.route.js';
import { productRouter } from './routes/product.route.js';
import { cartRouter } from './routes/cart.route.js';
import { addressRouter } from './routes/address.route.js';

// route declaretion

app.use("/api/v1/users", userRouter )
app.use("/api/v1/products", productRouter );
app.use("/api/v1/addresses", addressRouter );
app.use("/api/v1/cart", cartRouter );




export {app}