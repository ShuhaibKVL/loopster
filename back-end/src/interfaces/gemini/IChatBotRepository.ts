export interface IChatBotRepository{
    sendPrompt(prompt:string):Promise<unknown>
}