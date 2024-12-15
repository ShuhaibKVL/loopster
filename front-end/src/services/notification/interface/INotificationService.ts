export interface INotificationService{
    fetchNotification(userId:string):Promise<unknown>
    markAsReaded(notificationId:string):Promise<unknown>
}