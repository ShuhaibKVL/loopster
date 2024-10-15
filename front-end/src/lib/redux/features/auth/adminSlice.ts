import { createSlice } from "@reduxjs/toolkit";

export interface adminState{
    accessToken:string,
    isAuthenticated:boolean,
    loading:boolean,
    admin:any,
}

const initialState:adminState = {
    accessToken:'',
    isAuthenticated:false,
    loading:true,
    admin:null,
}

console.log("Before : state on admin Slice :",initialState)
const adminAuthReducer = createSlice({
    name:'adminAuth',
    initialState,
    reducers:{
        login : (state , action) =>{
            console.log('inside login in admin slice :',action.payload)
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
            state.admin = action.payload.email
        },
        logout : (state) => {
            state.accessToken = ''
            state.isAuthenticated = false
            state.loading = true
            state.admin = null
        }
    },
})

console.log("After : state on userSlice :",initialState)

export const { login, logout } = adminAuthReducer.actions
export default adminAuthReducer.reducer