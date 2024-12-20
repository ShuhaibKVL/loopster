import { userApi } from "../apis/axiosInstance";

export const isVerifiedJwt = async():Promise<unknown> => {
    try {
        const res = await fetch(`${userApi}/verifyjwt`,{
            method:'POST',
            credentials:'include',
            // headers:{
            //     'Content-Type':'application/json'
            // },
            // body:JSON.stringify(accessToken)
        });

        const response = await res.json()
        if(response.message !== 'Token Valid.'){
            return false
        } 
        else{
            return true
        }
    } catch (error) {
        console.log(error)
    }
}