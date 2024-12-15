import { INotification } from "../../models/notification"

export interface INotificationRepository{
    create(newNotification:INotification):Promise<unknown>
    deleteById(notificationId:string):Promise<unknown>
    deleteByDoc(notification:INotification):Promise<unknown>
    findByDoc(notification:INotification):Promise<unknown>
    fetchAll(userId:string):Promise<unknown>
    markAsReaded(notificationId:string):Promise<unknown>
}