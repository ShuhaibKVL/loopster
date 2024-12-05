import { IStoryResponse } from "@/lib/utils/interfaces/IStory";
import storyService from "@/services/story/storyService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";


interface InitialState{
    loggedUserStories:IStoryResponse[] | []
    followedUsersStories:IStoryResponse[] | []
}

const initialState : InitialState = {
    loggedUserStories : [],
    followedUsersStories:[],
} 

export const fetchStories = createAsyncThunk('story/fetch' , async(userId:string) => {
    const response =  await storyService.fetchStories(userId)
    return response?.stories
})


const storyReducer = createSlice({
    name:'storyReducer',
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchStories.fulfilled , ( state,action) => {
            state.followedUsersStories = action.payload?.followedUsersStories as WritableDraft<IStoryResponse>[];
            state.loggedUserStories = action.payload?.logineUserStories as WritableDraft<IStoryResponse>[];
        })
    }
})

export default storyReducer.reducer