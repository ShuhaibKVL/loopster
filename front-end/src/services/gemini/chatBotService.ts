import { IChatBotHistory } from "@/lib/utils/interfaces/IChatBotHistory";
import { chatBotApi} from "../apis/axiosInstance";
import { IChatBotService } from "./interfaces/IChatBotService";

export class ChatBotService implements IChatBotService{
    async sendPrompt(
        prompt: string, 
        token: string,
        userId:string,
        onStremaData: (chunk: string) => void, 
        onStreamEnd: () => void, 
        onError: (error: unknown) => void
    ): Promise<unknown> {
        const controller = new AbortController()
        const signal = controller.signal

        try {
            const response = await fetch(`${chatBotApi}/create-prompt?prompt=${encodeURIComponent(prompt)}&userId=${userId}`,{
                method:'GET',
                signal:signal,
                headers:{
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`, // Add the token here
                }
              })
        
              if (!response.body) {
                throw new Error('ReadableStream not supported in the response.');
              }
    
              const reader = response.body.getReader();
              const decoder = new TextDecoder('utf-8');
    
              while (true) {
                const { done, value } = await reader.read();
                if (done){
                  onStreamEnd()
                  break;
                }
                const chunkText = decoder.decode(value,{stream:true})
                onStremaData(chunkText)
            }
        } catch (error:unknown) {
            onError(error)
        }
        return controller // Retun controller to allow aborting.  
    }

    async getHistory(userId: string): Promise<{message:string,data:IChatBotHistory[],status:boolean}> {
        const response = await chatBotApi.get(`/${userId}/fetch-chat-history`)
        return response.data
    }

    
}

const chatBotService = new ChatBotService()
export default chatBotService