import { IStory } from "../../models/story"

export interface IStoryRepository{
    create(data:IStory):Promise<unknown>
    delete(storyId:string):Promise<unknown>
    fetchFollowed_Stories(userId:string):Promise<unknown>
}