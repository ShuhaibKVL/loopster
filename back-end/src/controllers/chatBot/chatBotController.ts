import { Request , Response } from 'express'
import { HttpStatus } from '../../enums/httpStatus'
import { IChatBotService } from '../../interfaces/gemini/IChatBotService'
import { model } from '../../config/gemini/generative-ai'
import { IChatBotSHistoryervice } from '../../interfaces/gemini/storeChat/IChatBotHistoryService'

export class ChatBotController{
    constructor(
        private chatBotService : IChatBotService,
        private chatBotHistoryService : IChatBotSHistoryervice
        
    ){}

    async getResponse(req:Request,res:Response):Promise<void>{
        try {
            const {prompt , userId} = req.query
            console.log('reached on propmt :',prompt)
            if(!prompt){
                res.status(HttpStatus.BAD_REQUEST).json({message:'prompt is missing',status:false})
                return
            }
            
            res.setHeader('Content-Type', 'text/plain'); // Stream plain text
            res.setHeader('Transfer-Encoding', 'chunked'); // Enable chunked transfer

            let fullResponse = ''
            const response =  await model.generateContentStream(prompt as string)

            // Print text as it comes in.
            for await (const chunk of response.stream) {
                 const chunkText = chunk.text();
                 if(!chunkText.includes('Creating')){
                    fullResponse += chunkText
                    console.log(">>>>",fullResponse)
                    res.write(chunkText)
                    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
                 }
                 console.log('>>',chunkText)  
            }
            // if the response is completed , store it in database for history.
            const store = await this.chatBotHistoryService.create(userId as string,fullResponse,prompt as string)
            console.log('store :',store)

            res.end()   
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async getHistory(req:Request,res:Response):Promise<unknown>{
        try {
            const { userId } = req.params
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'userId is missing',status:false})
                return
            }

            const historyChats = await this.chatBotHistoryService.fetch(userId as string)
            if(!historyChats){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to fetch chat bot history.',status:false})
                return
            }
            res.status(HttpStatus.OK).json({message:"chat bot history fetched successfully",data:historyChats,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }
}