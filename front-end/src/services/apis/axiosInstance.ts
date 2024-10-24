import axios from 'axios'
import store from '@/lib/redux/store/store'
import { error } from 'console'
import { logout } from '@/lib/redux/features/auth/userSlice'
import  Router from 'next/navigation'

// Base URL
export const BASE_URL = 'http://localhost:5000'

// Public URL for unauthenticated user request (signIn/ signUp)
export const user_publicApi = axios.create({
    baseURL:`${BASE_URL}/api/user`
})

//URL for authenticated user request (profile/feed)
export const userApi = axios.create({
    baseURL:`${BASE_URL}/api/user`
})

export const postApi = axios.create({
    baseURL:`${BASE_URL}/api/post`
})

// Public URL for unauthenticated admin request (signIn/ signUp)
export const admin_publicApi = axios.create({
    baseURL:`${BASE_URL}/api/admin`
})

//URL for authenticated admin request (profile/feed)
export const adminApi = axios.create({
    baseURL:`${BASE_URL}/api/admin`
})

userApi.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const token = state?.user?.accessToken

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

adminApi.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const token = state?.admin?.accessToken

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

postApi.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const token = state?.user?.accessToken
        console.log('token inside axios interceptor :',token)

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)


// handel backend middle ware authorisation
userApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        //If the server return 401 0r 403 , handle unauthorized access
        if(response?.status === 401 || response?.status === 403) {
            //Logout the user from Redux and clear token
            store.dispatch(logout())

            Router.redirect('/signIn')
        }

        return Promise.reject(error)
    }
)

adminApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        console.log('error error error error error error error >>>>>>>>>>>>>>>>>>',response)
        //If the server return 401 0r 403 , handle unauthorized access
        if(response?.status === 401 || response?.status === 403) {
            //Logout the user from Redux and clear token
            store.dispatch(logout())

            Router.redirect('/admin/signIn')
             // Router.replace('/signIn')
        }

        return Promise.reject(error)
    }
)

postApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        //If the server return 401 0r 403 , handle unauthorized access
        if(response?.status === 401 || response?.status === 403) {
            //Logout the user from Redux and clear token
            store.dispatch(logout())

            Router.redirect('/signIn')
        }

        return Promise.reject(error)
    }
)

