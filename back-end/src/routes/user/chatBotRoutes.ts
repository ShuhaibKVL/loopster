import { Router } from 'express'
import { authorize } from '../../middleware/userAuthMiddleware'
import { ChatBotRepository } from '../../repositories/gemini/chatBotRepository'
import { ChatBotService } from '../../services/gemini/chatBotService'
import { ChatBotController } from '../../controllers/chatBot/chatBotController'
import { ChatBotHistoryRepository } from '../../repositories/gemini/chatBotHistoryRepository'
import { ChatBotHistoryService } from '../../services/gemini/chatBotHistoryService'

const router : Router = Router()

const chatBotHistoryRepository = new ChatBotHistoryRepository()
const chatBotHistoryService = new ChatBotHistoryService(chatBotHistoryRepository)


const chatBotRepository = new ChatBotRepository()
const chatBotService = new ChatBotService(chatBotRepository)
const chatBotController = new ChatBotController(chatBotService,chatBotHistoryService)

router.use(authorize)
router.get('/create-prompt',chatBotController.getResponse.bind(chatBotController))
router.get('/:userId/fetch-chat-history',chatBotController.getHistory.bind(chatBotController))

export default router