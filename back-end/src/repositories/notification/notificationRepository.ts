import { INotificationRepository } from "../../interfaces/notification/INotificationRepository";
import Notification, { INotification } from "../../models/notification";

export class NotificationRepository implements INotificationRepository{
    
    async create(newNotification: INotification): Promise<unknown> {
        const isExist = await Notification.findOne(newNotification)
        console.log('is Exist notification :',isExist)
        if(isExist){
            return true
        }
        const createNotification = await Notification.create(newNotification)
        return await Notification.findById(createNotification?._id)
            .populate('userId','userName profileImage _id')
            .populate('senderId','userName profileImage _id')
            .populate('postId','content mediaUrl mediaType _id')
            .populate('commentId','comment postId')
    }

    async deleteById(notificationId: string): Promise<unknown> {
        return await Notification.findByIdAndDelete(notificationId)
    }

    async deleteByDoc(notification: INotification): Promise<unknown> {
        return await Notification.deleteOne(notification)
    }

    async findByDoc(notification: INotification): Promise<unknown> {
        return await Notification.findOne(notification)
    }

    async fetchAll(userId: string): Promise<unknown> {
        return await Notification.find({senderId:userId})
                    .sort({createdAt:-1})
                    .populate('userId','userName profileImage _id')
                    .populate('senderId','userName profileImage _id')
                    .populate('postId','content mediaUrl mediaType _id')
                    .populate('commentId','comment postId')
    }

    async markAsReaded(notificationId: string): Promise<unknown> {
        return await Notification.findByIdAndUpdate(notificationId,{isRead:true},{new:true})
    }
    
    
}