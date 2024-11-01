import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.get('/api/', (req, res) => {
    return res.json({msg:'success'})
})

const start = async () => {
    try {
        await connectMongoDB(process.env.MONGO_URI);
        app.listen(5000, () => {
            console.log(`Server khai ${PORT}`)
        });
        
    } catch (error) {
        console.log( error)
    }
    
};

start();


// PassMongo: F3Uu10H4CmoqUX1x