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

    async deleteById(notificationId: string): Promise<unknown> {
        return await this.notificationRepository.deleteById(notificationId)
    }

    async deleteByDoc(notification: INotification): Promise<unknown> {
        // to delte from fron-end sender, need the notification id
        const findNotification = await this.notificationRepository.findByDoc(notification)
        const deleteNotificaton = await this.notificationRepository.deleteByDoc(notification)
        if(deleteNotificaton){
            console.log("socket room :",io.sockets.adapter.rooms);
            console.log('notification emited to :',notification?.senderId)
            io.to(`user:${notification?.senderId}`).emit('notification-deleted',findNotification)
            
        }
        return deleteNotificaton
    }

    async fetchAll(userId: string): Promise<unknown> {
        return await this.notificationRepository.fetchAll(userId)
    }

    async markAsReaded(notificationId: string): Promise<unknown> {
        return await this.notificationRepository.markAsReaded(notificationId)
    }
}