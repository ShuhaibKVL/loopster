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
    console.log('the FETCH LATEST POSTS function invoked inside the reducer',userId,page)
    const response = await postService.getLatestPosts(userId,page)
    console.log('response.posts :',response.posts)
    return response?.posts
})

export const followedUsersPosts = createAsyncThunk('posts/followedUsersPosts',async({userId,page =1}:{userId:string,page?:number}) => {
    console.log('the FOLLOWED USERS  function invoked inside the reducer',userId,page)
    const response = await postService.getFollowedUserPosts(userId,page)
    console.log('response inside the reducer :',response)
    return response?.posts
})


const postReducer = createSlice({
    name:'postReducer',
    initialState,
    reducers:{
       setPage:(state,action) =>{
        console.log('page is settled to :',action.payload)
        state.page = action.payload
       }
    },
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

            .addCase(followedUsersPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(followedUsersPosts.fulfilled, (state , action) => {
                console.log('fetchLatesPosts fullfilled',action)
                state.posts = action.payload
                console.log('posts inside the addCase reducer :',state.posts)
            })
            .addCase(followedUsersPosts.rejected,(state,action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const { setPage } = postReducer.actions
export default postReducer.reducer