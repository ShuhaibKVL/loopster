import { io } from "../../controllers/socket.io/connectionHandler";
import { INotificationRepository } from "../../interfaces/notification/INotificationRepository";
import { INotificationService } from "../../interfaces/notification/INotificationService";
import { INotification } from "../../models/notification";

export class NotificationService implements INotificationService{
    constructor(
        private notificationRepository : INotificationRepository
    ){}

    async create(newNotification: INotification): Promise<unknown> {
        const create = await this.notificationRepository.create(newNotification)
        console.log('crate response inside the service :',create)
        if(create){
            console.log("socket room :",io.sockets.adapter.rooms);
            console.log('notification emited to :',newNotification.senderId)
            io.to(`user:${newNotification?.senderId}`).emit('notification',create)
            
        }
        return create
    }

    async fetchAll(userId: string): Promise<unknown> {
        return await this.notificationRepository.fetchAll(userId)
    }

    async markAsReaded(notificationId: string): Promise<unknown> {
        return await this.notificationRepository.markAsReaded(notificationId)
    }
}