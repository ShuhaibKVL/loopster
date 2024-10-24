import { jwtDecode } from 'jwt-decode';


const isTokenExpired = (token:string) => {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    // Check if 'exp' exists before comparing
    if (decoded.exp === undefined) {
        console.error('Token does not have an expiration time');
        return true;
    }
    return decoded.exp < currentTime
}

export default isTokenExpired