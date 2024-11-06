import cors from 'cors'
import express , { Request , Response } from 'express'
import globalErrorMiddleware from './middleware/globalErrorMiddleware'
import connectDB from './config/db/database'
import dotenv from 'dotenv'
import userRoutes from './routes/user/userRoutes'
import cookieParser from 'cookie-parser'
import './cron/deleteUnverifiedUsers'
import adminRoutes from './routes/admin/adminRoutes'
import postRoutes from './routes/user/postRoutes'
import unsplashRoutes from './routes/user/unsplashRoutes'

dotenv.config()

const app = express()
const port = 5000

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};


app.use(globalErrorMiddleware)
app.use(cookieParser())

app.use(cors(corsOptions))


app.use(express.json())
app.use(express.urlencoded({extended:true}))

connectDB().catch(err => {
    console.log("Data base connection error throw :",err.message)
    return
})

app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/post',postRoutes)
app.use('/api/unsplash',unsplashRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))