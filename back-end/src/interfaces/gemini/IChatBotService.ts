export interface IChatBotService{
    sendPrompt(prompt:string):Promise<unknown>
}