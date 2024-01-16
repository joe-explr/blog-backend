import express from 'express';
import dotenv from 'dotenv';
import connectDB  from './config/Dbconfig'
import userRoutes from './routes/userRoutes'
import {errorResponseHandler, invalidPathHandler} from './middleware/errorHandler'

dotenv.config()
connectDB();
const app = express();

app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Server listening.....")
})
app.use("/api/users",userRoutes)
app.use(invalidPathHandler)
app.use(errorResponseHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`);
})