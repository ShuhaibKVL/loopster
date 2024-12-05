import { GoogleGenerativeAI} from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_CHAT_BOAT_API as string)
export const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'})