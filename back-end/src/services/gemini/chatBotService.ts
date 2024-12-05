import { IChatBotRepository } from "../../interfaces/gemini/IChatBotRepository";
import { IChatBotService } from "../../interfaces/gemini/IChatBotService";

export class ChatBotService implements IChatBotService{
    constructor(
        private chatBotRepository : IChatBotRepository
    ){}

    async sendPrompt(prompt: string): Promise<unknown> {
        return await this.chatBotRepository.sendPrompt(prompt)
    }
}