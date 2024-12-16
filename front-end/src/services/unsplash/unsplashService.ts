import { IUnsplashService } from "./interfaces/IUnsplashServices";
import { BASE_URL, userApi } from "../apis/axiosInstance";
import { UnsplashImage } from "@/components/Libraries/Unsplash";

export class UnsplashService implements IUnsplashService {

    async searchImages(page: number, query: string, per_page: number): Promise<{result?:UnsplashImage[] ,status?:boolean}> {
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
            return response?.data
        } catch (error) {
            console.log(error)
            return {status:false}
           
        }
    }
}

const unsplashService = new UnsplashService()
export default unsplashService