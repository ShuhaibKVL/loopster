import { IsignIn } from "@/app/admin/(auth)/signIn/page"

export const signIn = async(formData:IsignIn):Promise<any> => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/signIn',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        });

        const res = await response.json()
        console.log("admin sign In response :",res)
        return res
    } catch (error) {
        
    }
}

export const getUsers = async():Promise<void> => {
    console.log('get users fucntion invoked..')
    try {
        const response = await fetch('http://localhost:5000/api/admin/getusers',{
            method:'GET',
        })
        const res = response.json()
        console.log("res :",res)
    } catch (error) {
        console.log(error)
    }
}