import { IStory, IStoryResponse } from "@/lib/utils/interfaces/IStory";
import { IStoryService } from "./Interfaces/IStoryService";
import { userApi } from "../apis/axiosInstance";

export class StoryService implements IStoryService{
    async create(data: IStory): Promise<{status:boolean,message:string,stories:IStory}> {
        const response = await userApi.post('/story/create',data)
        return response?.data
    }

    async fetchStories(userId: string): Promise<{status:boolean,message:string,stories:{followedUsersStories:IStoryResponse[],logineUserStories:IStoryResponse[]}}> {
        const response = await userApi.get(`/${userId}/story/latest-stories`)
        return response?.data
    }

    async delteStory(storyId:string):Promise<{message:string,status:boolean}>{
        const response = await userApi.delete(`/story/delete?storyId=${storyId}`)
        return response?.data
    }
}

const storyService = new StoryService()
export default storyService