import { createSlice } from "@reduxjs/toolkit";

export interface userState{
    accessToken:string,
    isAuthenticated:boolean,
    loading:boolean,
    user:any,
    userId:string,
    userProfile:string
}

const initialState:userState = {
    accessToken:'',
    isAuthenticated:false,
    loading:true,
    user:null,
    userId:'',
    userProfile:''
}

const userAuthReducer = createSlice({
    name:'userAuth',
    initialState,
    reducers:{
        login : (state , action) =>{
           console.log('inside login in slice :',action.payload)
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
            state.user = action.payload.user.userName
            state.userId = action.payload.user._id
            state.userProfile = action.payload.user.profileImg
        },
        logout : (state) => {
            state.accessToken = ''
            state.isAuthenticated = false
            state.loading = true
            state.user = null
            state.userId = ''
            state.userProfile = ''
        }
    },
})

export const { login, logout } = userAuthReducer.actions
export default userAuthReducer.reducer