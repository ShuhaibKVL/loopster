import { IStory } from "@/lib/utils/interfaces/IStory";

export interface IStoryService{
    create(data:IStory):Promise<unknown>
    fetchStories(userId:string):Promise<unknown>
}