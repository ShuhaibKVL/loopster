'use client'

import notificationService from "@/services/notification/notificationService";
import { SocketContext } from "./socketContext";
import React, { useContext, createContext, useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/typedUseDispatch";
import { RootState } from "@/lib/redux/store/store";
import { INotificationResponse } from "@/lib/utils/interfaces/INotification";

interface NotificationContextProps {
    notifications: INotificationResponse[] | [];
    unReadedNotifications:number;
    markAsRead: (id: string) => void;
    clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined)

export const NotificationProvider : React.FC<{children: React.ReactNode}> = ({children}) => {
    const [ notifications , setNotifications ] = useState<INotificationResponse[] | []>([])
    const [ unReadedNotifications , setUnReadedNotifications ] = useState<number>(0)
    
    const socket = useContext(SocketContext)
    const userId = useAppSelector((state:RootState) => state?.user?.userId)

    useEffect(() => {
        console.log('waiting .................');
        const handleNotification = (newNotification : INotificationResponse) => {
            console.log('notification response reached on client:', newNotification);
            setNotifications((prev) => [newNotification, ...prev]);
        };
        socket.on('notification', handleNotification);
    
        return () => {
            socket.off('notification', handleNotification); // Only remove the listener
        };
    }, []);

    const findUnReaded = (notifications:INotificationResponse[]) =>{
        let count : number = 0
        notifications?.map((item:INotificationResponse) => {
            if(item?.isRead === false) count++
        })
        console.log('unReaded notifications :',count)
        setUnReadedNotifications(count)
    }
    
    const fetchNotifications = async() => {
        const response = await notificationService.fetchNotification(userId)
        console.log('response inside the notification context :',response)
        setNotifications(response?.notifications)

        findUnReaded(response?.notifications)
    }

    useEffect(() => {
        fetchNotifications()
    },[userId])

    // Mark a notification as read
    const markAsRead =  async(id: string) => {
        setNotifications((prev) =>
          prev.map((notification:INotificationResponse) =>
            notification._id.toString() === id ? { ...notification, isRead: true } : notification
          )
        );

        const update = await notificationService.markAsReaded(id)
        console.log('mark as readed upated :',update)

        findUnReaded(notifications)
    };

    const clearNotifications =() => {
        setNotifications([])
    }

    return (
        <NotificationContext.Provider value={{
            notifications,
            unReadedNotifications,
            markAsRead,
            clearNotifications
        }} >
            {children}
        </NotificationContext.Provider>
    )    
}

// Hook to use the NotificationContext
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
  };