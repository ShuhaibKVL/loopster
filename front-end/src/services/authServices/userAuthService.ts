export async function signUp(data : Object):Promise<any>{
    console.log("signUp function invoked.")

    try {
        const res = await fetch('http://localhost:5000/api/user/register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        });

        if(!res.ok){
            const errorResult = await res.json()
            throw new Error(errorResult.message || 'Unknown error occurred');
        }

        const result = await res.json()
        console.log("The result is  :",result)
        return result

    } catch (error:any) {
        console.error("Error during sign up :",error.message)
        throw error
    }
}

export async function verifyOtp(email:string,otp:string):Promise<any> {
    try {
        const res = await fetch('http://localhost:5000/api/user/verifyOtp',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email:email,otp:otp})
        });
        return await res.json()
    } catch (error:any) {
        console.log("error on verify user service :",error.message)
    }
}

export async function resendOtp(email:string):Promise<any> {
    try {
        const res = await fetch('http://localhost:5000/api/user/resendotp',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email:email})
        });
        return await res.json()
    } catch (error:any) {
        console.log("Error on resendOtp :",error.message)
    }
}

export async function signIn(data : Object){
    const res = await fetch('http://localhost:5000/api/user/signIn',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    });

    const result = await res.json()
    console.log("sign in result :",result)
    return result
}

