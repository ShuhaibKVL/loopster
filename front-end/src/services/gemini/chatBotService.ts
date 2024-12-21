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
          console.log('chat boat api :',chatBotApi,)
            const response = await fetch(`${chatBotApi}/create-prompt?prompt=${encodeURIComponent(prompt)}&userId=${userId}`,{
                method:'GET',
                signal:signal,
                headers:{
                  'Accept': 'text/event-stream',
                  Authorization: `Bearer ${token}`, // Add the token here
                }
              })
        
              if (!response.body) {
                throw new Error('ReadableStream not supported in the response.');
              }
    
              const reader = response.body.getReader();
              const decoder = new TextDecoder();
    
              while (true) {
                const { done, value } = await reader.read();
                if (done){
                  onStreamEnd()
                  break;
                }
                const chunk = decoder.decode(value)
                // onStremaData(chunkText)
                const lines = chunk.split('\n');

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                      const data = line.slice(6);
                      
                      if (data === '[DONE]') {
                          onStreamEnd();
                          return;
                      }
  
                      try {
                          const parsedData = JSON.parse(data);
                          if (parsedData.text) {
                            onStremaData(parsedData.text);
                          }
                      } catch (e:unknown) {
                          console.warn('Failed to parse chunk:', data,e);
                      }
                  }
              }
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