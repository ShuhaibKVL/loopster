import { isVerifiedJwt } from "@/services/authServices/jwtService";
import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";

export interface userState{
    accessToken:string,
    isAuthenticated:boolean,
    loading:boolean,
    user:any,
    userId:string
}

const initialState:userState = {
    accessToken:'',
    isAuthenticated:localStorage.getItem('accessToken')?true:false,
    loading:true,
    user:null,
    userId:''
}

console.log("Before : state on userSlice :",initialState)

// export const verifyUserExist = createAsyncThunk(
//     'userAuth/verifyUserExist',
//     async() => {
//         console.log('verify user exist user slice invoked....',initialState.accessToken)
//         const response = await isVerifiedJwt(initialState.accessToken)
//         console.log("response :",response)
//     }
// )

const userAuthReducer = createSlice({
    name:'userAuth',
    initialState,
    reducers:{
        login : (state , action) =>{
            console.log("login slice invoked :",action.payload)
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = localStorage.getItem('accessToken') ? true:false
            state.user = action.payload.userData.userName
            state.userId = action.payload.userData._id
            localStorage.setItem('accessToken',action.payload.accessToken)
        },
        logout : (state) => {
            state.accessToken = ''
            state.isAuthenticated = localStorage.getItem('accessToken') ? true:false
            state.loading = true
            state.user = null
            state.userId = ''
            localStorage.removeItem('accessToken')
        }
    },
    // extraReducers : (builder) => {
    //     builder
    //     .addCase(verifyUserExist.fulfilled, (state) => {
    //         console.log("verify user exist slice fulfilled")
    //     })
    //     .addCase(verifyUserExist.rejected, (state) => {
    //         console.log("verify user exist slice rejected..!")
    //     })
    // }
})

console.log("After : state on userSlice :",initialState)

export const { login, logout } = userAuthReducer.actions
export default userAuthReducer.reducer