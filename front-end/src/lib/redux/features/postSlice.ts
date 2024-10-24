import postManagementService from "@/services/admin/postManagmentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "@/services/user/post/postServices";


interface IInitialState{
    posts:[],
    status:"loading" | "success" | 'failed' | 'idle',
    error:undefined | string

}
const initialState: IInitialState = {
    posts:[],
    status:'idle',
    error:undefined
}

export const fetchLatestPosts = createAsyncThunk('posts/fetchLatestPosts',async(userId:string) => {
    console.log('the fetch latests posts function invoked inside the reducer')
    const response = await postService.getLatestPosts(userId)
    console.log('response >>:',response)
    return response?.posts
})

const postReducer = createSlice({
    name:'postReducer',
    initialState,
    reducers:{},
    extraReducers :(builder) => {
        builder
            .addCase(fetchLatestPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchLatestPosts.fulfilled, (state , action) => {
                console.log('fetchLatesPosts fullfilled',action)
                state.posts = action.payload
                console.log('posts inside the addCase reducer :',state.posts)
            })
            .addCase(fetchLatestPosts.rejected,(state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default postReducer.reducer