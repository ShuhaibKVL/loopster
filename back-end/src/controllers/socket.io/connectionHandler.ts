import { IMessage } from "../../models/message";
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { chatRepository, messageService } from "../../routes/user/chatRoutes";
import { ObjectId } from "mongoose";
import { S3Service } from "../../services/admin/S3Services.ts/S3Service";

const app = express()

const server = http.createServer(app)

const io = new Server(server,{
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST",'PUT', 'DELETE']
    },
    maxHttpBufferSize: 25 * 1024 * 1024,
    transports: ['websocket', 'polling'],
});

export interface IChatResponse{
    _id:string,
    chatName?:string,
    isGroupChat:boolean,
    latestMessage?:ObjectId,
    groupImage?:string,
    groupAdmin?:ObjectId,
    users:[
        {userName:string,fullName:string,profileImage:string,_id:string}
    ]
    createdAt:string
}

export interface IUnreadChatMsg{
    _id:string,
    unReadMsg:number
}

const onlineUsers = new Map();
const s3Service = new S3Service()

io.on('connection',(socket) => {
    console.log('user connected on socket.io :',socket.id)

    // Join individual chat room
    socket.on('joinIndividualChat',(userId) => {
        console.log('joined........',userId)
        socket.join(`user:${userId}`)
    })

    // Join group chat room
    socket.on('joinGroupChat',(groupId) => {
        console.log('group join....',groupId)
        socket.join(`group:${groupId}`)
    })

    // to store the online users id
    socket.on('user-online',(data) => {
        const {socketId , userId} = data
        console.log('user-online :',data)
        
        if(!onlineUsers.has(socketId)){
            console.log('added')
            onlineUsers.set(socketId,userId)
        }else{
            console.log('all ready existed :',onlineUsers.get(socketId))
        }

        // while a new user-online updated, udate alos users
        io.emit('updated-online-users',Array.from(onlineUsers.values()))
    })

    // Handle individual message
    socket.on('sendIndividualMessage',async(data) => {
        try {
            console.log('socket io sendIndividualmessage invoked...')   
            const { senderId , chatId , content,mediaType,fileBuffer, filename } = data
            console.log(senderId,"<>",chatId,"<>",content,"<>",mediaType,"<>",fileBuffer,'<>',filename)

            let imageUrl ;
            if(mediaType !== 'none'){
                if(!fileBuffer){
                    throw Error('file is missing')
                }
    
                //  fileName = `${filename}-${Date.now()}.${fileExtension}`;
                 let fileName = `${filename}`;
                console.log('fileName :',fileName,"FileBuffer :",fileBuffer)
                imageUrl = await s3Service.uploadFile(fileBuffer,fileName)
                console.log("s3 response image url :",imageUrl)   
            }
            
            const newMessage : IMessage = {
                sender:senderId,
                content,
                chatType:'individual',
                chatId:chatId,
                mediaType:mediaType,
                fileName:filename,
                mediaUrl:imageUrl
            }

            const chat  = await chatRepository.fetchChat(chatId)
            const existedChat :IChatResponse = chat as IChatResponse
            const receiverId = existedChat?.users.find((id) => id._id.toString() !==  senderId)
            const response = await messageService.create(newMessage)
            console.log('message created :',response)

            //Emit to sender and receiver
            io.to(`user:${senderId}`).to(`user:${receiverId}`).emit('receiveMessage',{
                message:response,
                activeMessage:chatId,
                chatType:'individual'
            })
            
        } catch (error) {
            console.error('Error on sending individaul message :',error)
        }
    })

    //Handle group message
    socket.on('sendGroupMessage',async(data) => {
        try {
            const { senderId, content ,chatId,mediaType,fileBuffer,filename} = data;
            console.log(senderId,"<>",chatId,"<>",content,"<>",mediaType,"<>",fileBuffer)

            let imageUrl ;
            if(mediaType !== 'none' && !fileBuffer ){
                throw Error('file is missing')
            }

            //  fileName = `${filename}-${Date.now()}.${fileExtension}`;
            let fileName = `${filename}`;
            console.log('fileName :',fileName,"FileBuffer :",fileBuffer)
            imageUrl = await s3Service.uploadFile(fileBuffer,fileName)
            console.log("s3 response image url :",imageUrl)   

            const newMessage : IMessage = {
                sender:senderId,
                content,
                chatType:'group',
                chatId:chatId,
                mediaType:mediaType,
                fileName:filename,
                mediaUrl:imageUrl
            }
            
            const response = await messageService.create(newMessage)
            // Emit to all group members
            io.to(`user:${senderId}`).to(`group:${chatId}`).emit('receiveMessage', {
              message:response,
              activeMessage:chatId,
              chatType: 'group'
            });

        } catch (error) {
            console.error('Error on send groupMessage socket :',error)
        }
    })

    socket.on('markmessagesAsReaded',async(data) => {
        try {
            const { extractMsgIds ,userId } = data
            console.log('data on markmessageAsReaded socke.io :',extractMsgIds,"userId :",userId)
            // update all message as readed 
            const updateMessage = await messageService.markMsgAsReaded(userId,extractMsgIds)
            if(!updateMessage){
                throw new Error('failed to update messages as readed')
                return
            }
            const unReadMessagesPerChat =await messageService.unReadMessagesPerChat(userId)
            console.log('unReadMessagePerChat :',unReadMessagesPerChat)

            const totalUnreadMessage =await messageService.totalUnReadMessages(userId)
            console.log('totalUnRead messages :',totalUnreadMessage)

            const convertedUnReadMsg = unReadMessagesPerChat as IUnreadChatMsg[]
            const chatIds = convertedUnReadMsg.map((chat) => chat?._id)

            io.to(`user:${userId}`).emit('updatedUnReadMessage',{
                unReadMessagesPerChat,
                totalUnreadMessage
            })

        } catch (error) {
            console.log('error on socke.io while message mark as readed :',error)
        }
    })

    socket.on('onTyping...',async(data) => {
        try {
            console.log('onType >')
            const { senderId , chatId } = data
            console.log(">>",senderId,chatId)

            io.to(`group:${chatId}`).emit('typing...',{
                chatId,
                senderId
            })
        } catch (error) {
            console.log('error on socke.io while onType event :',error)
        }
    })

    socket.on('on-type-end',async(data) => {
        try {
            console.log('on end type')
            const { senderId , chatId } = data
            console.log(">>",senderId,chatId)

            io.to(`group:${chatId}`).emit('type-ended',{
                chatId,
                senderId
            })
            
        } catch (error) {
            console.log('error on socke.io while end type event :',error)
        }
    })

    socket.on('disconnect',() => {
        console.log('User disconnected :',socket.id)
        onlineUsers.delete(socket?.id)
        console.log('updated online users :',onlineUsers)
        console.log('online users Map()',onlineUsers)
        // while a new user-online updated, udate alos users
        io.emit('updated-online-users',Array.from(onlineUsers.values()))

    })
})

export { io , server , app}