import { model } from '../../config/gemini/generative-ai'
import { IChatBotRepository } from "../../interfaces/gemini/IChatBotRepository";

export class ChatBotRepository implements IChatBotRepository{
    async sendPrompt(prompt: string): Promise<unknown> {
        //using streaming to delver data without waiting to get entire data
        let fullResponse = ''
        const response =  await model.generateContentStream(prompt)

        for await (const chunk of response.stream) {
             const chunkText = chunk.text();
             if(!chunkText.includes('Creating')){
                fullResponse += chunkText
             }
             process.stdout.write(chunkText);          
        }
        return fullResponse
    }
}   