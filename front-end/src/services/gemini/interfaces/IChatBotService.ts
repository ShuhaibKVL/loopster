export interface IChatBotService{
    sendPrompt(
        prompt:string,
        token:string,
        userId:string,
        onStremaData:(chunk:string) => void,
        onStreamEnd:() => void,
        onError:(error:Error) => void
    ):Promise<unknown>

    getHistory(userId:string):Promise<unknown>
}