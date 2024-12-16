import { createSlice } from "@reduxjs/toolkit";

export interface adminState{
    accessToken:string,
    isAuthenticated:boolean,
    loading:boolean,
    admin:null | string,
}

const initialState:adminState = {
    accessToken:'',
    isAuthenticated:false,
    loading:false,
    admin:null,
}

const adminAuthReducer = createSlice({
    name:'adminAuth',
    initialState,
    reducers:{
        login : (state , action) =>{
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

export const { login, logout } = adminAuthReducer.actions
export default adminAuthReducer.reducer