'use client'

import { logout } from "@/lib/redux/features/auth/userSlice";
import store, { RootState } from "@/lib/redux/store/store";
import isTokenExpired from "@/lib/utils/isTokenExpired";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";

const restrictedRoutes = ['/admin/signIn'];

const adminWithAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, requiresAuth: boolean) => {

const RequiresAuth = (props: P) => {
    const router = useRouter();
    const accessToken = useSelector((state: RootState) => state.admin?.accessToken);

    useLayoutEffect(() => {
        if (accessToken) {
            const isExpired = isTokenExpired(accessToken);
            if (isExpired) {
            store.dispatch(logout());
            router.push("/admin/signIn");
            return;
            }

            // Redirect if user is authenticated and on restricted routes
            if (!requiresAuth && restrictedRoutes.includes(window.location.pathname)) {
            router.push("/admin/dashboard");
            return;
            }
        } else {
            // If not authenticated, redirect to signIn
            if (requiresAuth) {
            router.push("/admin/signIn");
            return;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, requiresAuth, router]);

    // If accessToken is not available and requires authentication, show nothing during redirection
    if (!accessToken && requiresAuth) {
        return null;
    }

    // Render the wrapped component if authenticated or if no authentication is required
    return <WrappedComponent {...props} />;
};

    return RequiresAuth;
};

export default adminWithAuth;