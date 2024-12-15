import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "@/services/user/post/postServices";

interface IInitialState{
    posts:[],
    page:number,
    status:"loading" | "success" | 'failed' | 'idle',
    error:undefined | string

}
const initialState: IInitialState = {
    posts:[],
    page:1,
    status:'idle',
    error:undefined
}

export const fetchLatestPosts = createAsyncThunk('posts/fetchLatestPosts',async({userId,page =1}:{userId:string,page?:number}) => {
    const response = await postService.getLatestPosts(userId,page)
    return response?.posts
})

export const followedUsersPosts = createAsyncThunk('posts/followedUsersPosts',async({userId,page =1}:{userId:string,page?:number}) => {
    const response = await postService.getFollowedUserPosts(userId,page)
    return response?.posts
})


const postReducer = createSlice({
    name:'postReducer',
    initialState,
    reducers:{
       setPage:(state,action) =>{
        state.page = action.payload
       }
    },
    extraReducers :(builder) => {
        builder
            .addCase(fetchLatestPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchLatestPosts.fulfilled, (state , action) => {
                state.posts = action.payload
            })
            .addCase(fetchLatestPosts.rejected,(state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            .addCase(followedUsersPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(followedUsersPosts.fulfilled, (state , action) => {
                state.posts = action.payload
            })
            .addCase(followedUsersPosts.rejected,(state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const { setPage } = postReducer.actions
export default postReducer.reducer