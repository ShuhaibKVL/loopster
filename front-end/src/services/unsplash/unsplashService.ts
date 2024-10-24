import axios from "axios";
import { IUnsplashService } from "./interfaces/IUnsplashServices";
import { BASE_URL, userApi } from "../apis/axiosInstance";

export class UnsplashService implements IUnsplashService {

    async searchImages(page: number, query: string, per_page: number): Promise<any> {
        console.log('unsplash service invoked')
        try {
            // const response = await axios.get(`http://localhost:5000/api/unsplash/search-unsplash-images?page=${page}&query=${query}&per_page=${per_page}`)
            const response = await userApi.get('/search-unsplash-images',{
                baseURL:`${BASE_URL}/api/unsplash`,
                params:{
                    page,
                    query,
                    per_page
                }
            })
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
}

const unsplashService = new UnsplashService()
export default unsplashService