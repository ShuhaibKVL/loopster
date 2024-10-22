import { logout } from "@/lib/redux/features/auth/userSlice";
import store, { RootState } from "@/lib/redux/store/store";
import isTokenExpired from "@/lib/utils/isTokenExpired";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const restrictedRoutes = ['/signIn', '/signUp', '/signUp/otp', '/'];

const withAuth = (WrappedComponent: React.ComponentType, requiresAuth: boolean) => {
    console.log("with auth invoked .......");

const RequiresAuth = (props: any) => {
    const router = useRouter();
    const accessToken = useSelector((state: RootState) => state.user?.accessToken);

    useEffect(() => {
        if (accessToken) {
            const isExpired = isTokenExpired(accessToken);
            if (isExpired) {
            console.log("Token expired, logging out and redirecting to signIn");
            store.dispatch(logout());
            router.push("/signIn");
            return;
            }

            // Redirect if user is authenticated and on restricted routes
            if (!requiresAuth && restrictedRoutes.includes(window.location.pathname)) {
            router.push("/feed");
            return;
            }
        } else {
            // If not authenticated, redirect to signIn
            if (requiresAuth) {
            router.push("/signIn");
            return;
            }
        }
    }, [accessToken, requiresAuth, router]);

    // If accessToken is not available and requires authentication, show nothing during redirection
    if (!accessToken && requiresAuth) {
        console.log("Redirecting, returning null");
        return null;
    }

    // Render the wrapped component if authenticated or if no authentication is required
    return <WrappedComponent {...props} />;
};

    return RequiresAuth;
};

export default withAuth;
