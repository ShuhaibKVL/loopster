import { createSlice } from "@reduxjs/toolkit";

export interface userState{
    accessToken:string,
    isAuthenticated:boolean,
    loading:boolean,
    user:any,
    userId:string
}

const initialState:userState = {
    accessToken:'',
    isAuthenticated:false,
    loading:true,
    user:null,
    userId:''
}

// console.log("Before : state on userSlice :",initialState)
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
        },
        logout : (state) => {
            state.accessToken = ''
            state.isAuthenticated = false
            state.loading = true
            state.user = null
            state.userId = ''
        }
    },
})

// console.log("After : state on userSlice :",initialState)

export const { login, logout } = userAuthReducer.actions
export default userAuthReducer.reducer