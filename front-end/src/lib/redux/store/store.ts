import { configureStore ,combineReducers} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistStore , persistReducer } from 'redux-persist'

import userAuthReducer from '../features/auth/userSlice'
import adminAuthReducer from '../features/auth/adminSlice'
import postReducer from '../features/postSlice'
import storyReducer from '../features/storySlice'

const rootReducer = combineReducers({
    user:userAuthReducer,
    admin:adminAuthReducer,
    post:postReducer,
    stories:storyReducer
})

const persistConfig = {
    key : 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig , rootReducer)

const store = configureStore({
    reducer: persistedReducer
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export default store;

