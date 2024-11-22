import { INotificationResponse } from "@/lib/utils/interfaces/INotification";
import { postApi, userApi } from "../apis/axiosInstance";
import { INotificationService } from "./interface/INotificationService";

export class NotificationService implements INotificationService{
    async fetchNotification(userId: string): Promise<{notifications:INotificationResponse[]}> {
        const response = await userApi.get(`/get-notifications?userId=${userId}`)
        return response.data
    }

    async markAsReaded(notificationId: string): Promise<unknown> {
        const response = await userApi.patch(`/mark-as-readed?id=${notificationId}`)
        return response.data
    }
}

const notificationService = new NotificationService()
export default notificationService