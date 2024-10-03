import { configureStore } from '@reduxjs/toolkit'
import userAuthReducer from '../features/auth/userSlice'



const store = configureStore({
    reducer:{
        user:userAuthReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;