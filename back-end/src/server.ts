import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/db/database'
import { app, server } from './controllers/socket.io/connectionHandler'
import './cron/deleteUnverifiedUsers'
import globalErrorMiddleware from './middleware/globalErrorMiddleware'
import adminRoutes from './routes/admin/adminRoutes'
import chatBotRoutes from './routes/user/chatBotRoutes'
import chatRoutes from './routes/user/chatRoutes'
import postRoutes from './routes/user/postRoutes'
import unsplashRoutes from './routes/user/unsplashRoutes'
import userRoutes from './routes/user/userRoutes'

dotenv.config()

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
app.use('/api/chat',chatRoutes)
app.use('/api/chat-boat',chatBotRoutes)

server.listen(port, () => console.log(`Example app listening on port ${port}!`))