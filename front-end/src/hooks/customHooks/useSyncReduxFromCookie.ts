'use client'

import { useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { useAppDispatch, useAppSelector } from '../typedUseDispatch';
import { login } from '@/lib/redux/features/auth/userSlice';
import { RootState } from '@/lib/redux/store/store';

export default function useSyncReduxFromCookie() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state:RootState) => state?.user?.userId)

    useEffect(() => {
        const sessionCookie = getCookie('session');
        if (sessionCookie && !userId) {
            const sessionData = JSON.parse(sessionCookie);
            dispatch(login(sessionData));
        }
    }, [dispatch,userId]);
}
