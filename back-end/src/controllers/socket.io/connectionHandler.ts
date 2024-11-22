import { IMessage, Message } from "../../models/message";
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { MessageService } from "../../services/chat/messageService";
import { chatRepository, messageService } from "../../routes/user/chatRoutes";
import { ObjectId } from "mongoose";

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
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

    // Handle individual message
    socket.on('sendIndividualMessage',async(data) => {
        try {
            console.log('socket io sendIndividualmessage invoked...')   
            const { senderId , chatId , content } = data

            const newMessage : IMessage = {
                sender:senderId,
                content,
                chatType:'individual',
                chatId:chatId
            }

            const chat  = await chatRepository.fetchChat(chatId)
            const existedChat :IChatResponse = chat as IChatResponse
            const receiverId = existedChat?.users.find((id) => id._id.toString() !==  senderId)
            const response = await messageService.create(newMessage)

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
            const { senderId, content ,chatId} = data;
            console.log('group message >>  :',data)
            const newMessage : IMessage = {
                sender:senderId,
                content,
                chatType:'group',
                chatId:chatId
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

            console.log('chat id s >>>>>>>> ',chatIds)

            io.to(`user:${userId}`).emit('updatedUnReadMessage',{
                unReadMessagesPerChat,
                totalUnreadMessage
            })

            // chatIds.forEach((chatId) => {
            //     io.to(`group:${chatId}`).emit('updatedUnReadMessage', {
            //         unReadMessagesPerChat,
            //         totalUnreadMessage,
            //     });
            // });

        } catch (error) {
            console.log('error on socke.io while message mark as readed :',error)
        }
    })

    socket.on('disconnect',() => {
        console.log('User disconnected :',socket.id)
    })
})

export { io , server , app}