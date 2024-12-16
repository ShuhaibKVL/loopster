import { IStoryResponse } from "@/lib/utils/interfaces/IStory";
import { IUserWithCounts } from "@/lib/utils/interfaces/IUserWIthCounts";
import storyService from "@/services/story/storyService";
import userAuthService from "@/services/user/userAuthService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";


interface InitialState{
    loading:boolean;
    loggedUserStories:IStoryResponse[] | []
    followedUsersStories:IStoryResponse[] | []
    profileUserData:IUserWithCounts | null ;// to store the profile page user Data
}

const initialState : InitialState = {
    loading:false,
    loggedUserStories : [],
    followedUsersStories:[],
    profileUserData:null
} 

export const fetchStories = createAsyncThunk('story/fetch' , async(userId:string) => {
    const response =  await storyService.fetchStories(userId)
    return response?.stories
})

    // for user data in profile page
export const getProfileUserData = createAsyncThunk('profile/get-user-data',async(userId:string) => {
    const user = await userAuthService.user(userId)
    return user?.userData[0]
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
        
        .addCase(getProfileUserData.pending, (state) => {
            state.loading = true;
        })
        .addCase(getProfileUserData.fulfilled, (state, action) => {
            state.loading = false;
            state.profileUserData = action.payload;
        })
        .addCase(getProfileUserData.rejected, (state) => {
            state.loading = false;
        }); 
    }
})

export default storyReducer.reducer