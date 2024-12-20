import { createSlice } from "@reduxjs/toolkit";
import { ObjectId } from "mongoose";

export interface userState{
    accessToken:string;
    isAuthenticated:boolean;
    loading:boolean;
    user:string | null;
    userId:string;
    userProfile:string;
    totalUnReadMessages:number;
    unReadMsgPerChat:{ _id: ObjectId, unReadMsg: number }[] | null;
}

const initialState:userState = {
    accessToken:'',
    isAuthenticated:false,
    loading:false,
    user:null,
    userId:'',
    userProfile:'',
    totalUnReadMessages:0,
    unReadMsgPerChat:null,
}

const userAuthReducer = createSlice({
    name:'userAuth',
    initialState,
    reducers:{
        login : (state , action) =>{
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
            state.user = action.payload.user.userName
            state.userId = action.payload.user._id
            state.userProfile = action.payload.user.profileImg
            state.totalUnReadMessages = action.payload.totalUnReadMessages
            state.loading = false
        },
        logout : (state) => {
            state.accessToken = ''
            state.isAuthenticated = false
            state.loading = false
            state.user = null
            state.userId = ''
            state.userProfile = ''
            state.unReadMsgPerChat = null
            state.totalUnReadMessages = 0
        },
        updateTotalUnReadMsg : (state,action) => {
            state.totalUnReadMessages = action.payload.totalUnReadMessages
        },
        updateUnReadMsgPerChat : (state,action) => {
            state.unReadMsgPerChat = action.payload
        },
        setLoading : (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { login, logout , updateTotalUnReadMsg , updateUnReadMsgPerChat, setLoading } = userAuthReducer.actions
export default userAuthReducer.reducer