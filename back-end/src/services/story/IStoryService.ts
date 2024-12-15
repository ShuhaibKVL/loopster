import { IStoryRepository } from "../../interfaces/story/IStoryRepository";
import { IStoryService } from "../../interfaces/story/IStoryService";
import { IStory } from "../../models/story";

export class StoryService implements IStoryService{
    constructor(
        private storyRepository : IStoryRepository
    ){}

    async create(data: IStory): Promise<unknown> {
        return await this.storyRepository.create(data)
    }

    async fetchFollowed_Stories(userId: string): Promise<unknown> {
        return await this.storyRepository.fetchFollowed_Stories(userId)
    }

    async delete(storyId: string): Promise<unknown> {
        return await this.storyRepository.delete(storyId)
    }
}