
export const isVerifiedJwt = async():Promise<any> => {
    console.log("inside middleware")

    try {
        const res = await fetch('http://localhost:5000/api/user/verifyjwt',{
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