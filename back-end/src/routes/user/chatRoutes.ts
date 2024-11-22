import { Router } from "express";
import { authorize } from "../../middleware/userAuthMiddleware";
import { ChatRepository } from "../../repositories/chat/IChatRepository";
import { ChatService } from "../../services/chat/chatService";
import { ChatController } from "../../controllers/chat/chatController";
import { MessageRepository } from "../../repositories/chat/messageRepository";
import { MessageService } from "../../services/chat/messageService";
import { MessageController } from "../../controllers/chat/messageController";


const router:Router = Router()

const messageRepository = new MessageRepository()
export const messageService = new MessageService(messageRepository)
const messageController = new MessageController(messageService)

export const chatRepository = new ChatRepository()
const chatService = new ChatService(chatRepository)
const chatController = new ChatController(chatService,messageService)

router.use(authorize)

router.post('/create',chatController.createChat.bind(chatController))
router.get('/get-all-chats',chatController.fetchAllChats.bind(chatController))

router.post('message/create',messageController.createMessage.bind(messageController))
router.get('/message/fetch-messages',messageController.fetchMessages.bind(messageController))

export default router