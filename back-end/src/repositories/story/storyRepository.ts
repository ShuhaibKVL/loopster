import mongoose from "mongoose";
import { IStoryRepository } from "../../interfaces/story/IStoryRepository";
import Follow from "../../models/followCollectionModal";
import Story, { IStory } from "../../models/story";

export class StoryRepository implements IStoryRepository{
    async create(data: IStory): Promise<unknown> {
        return await Story.create(data)
    }

    async fetchFollowed_Stories(userId: string): Promise<unknown> {
        try {
            const followedUsers = await Follow.find({follower:userId},{follower:0,_id:0})
            const followedUserIds = followedUsers.map(follow => new mongoose.Types.ObjectId(follow.following.toString()));
            const followedUsersStories =  await Story.find({userId:{$in:followedUserIds}}).populate('userId','userName _id profileImage')
            const logineUserStories = await Story.find({userId:userId}).populate('userId','userName _id profileImage')

            return {logineUserStories,followedUsersStories}
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async delete(storyId: string): Promise<unknown> {
        return await Story.findByIdAndDelete(storyId)
    }
}