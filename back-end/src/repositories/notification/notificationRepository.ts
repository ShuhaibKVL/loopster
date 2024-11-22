import { INotificationRepository } from "../../interfaces/notification/INotificationRepository";
import Notification, { INotification } from "../../models/notification";

export class NotificationRepository implements INotificationRepository{
    
    async create(newNotification: INotification): Promise<unknown> {
        const createNotification = await Notification.create(newNotification)
        return await Notification.findById(createNotification?._id)
            .populate('userId','userName profileImg _id')
            .populate('senderId','userName profileImg _id')
            .populate('postId','content mediaUrl mediaType _id')
            .populate('commentId','comment postId')
    }

    async fetchAll(userId: string): Promise<unknown> {
        return await Notification.find({senderId:userId})
                    .sort({createdAt:-1})
                    .populate('userId','userName profileImg _id')
                    .populate('senderId','userName profileImg _id')
                    .populate('postId','content mediaUrl mediaType _id')
                    .populate('commentId','comment postId')
    }

    async markAsReaded(notificationId: string): Promise<unknown> {
        return await Notification.findByIdAndUpdate(notificationId,{isRead:true},{new:true})
    }
    
}