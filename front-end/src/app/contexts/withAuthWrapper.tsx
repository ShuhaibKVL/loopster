'use client'

import withAuth from "./withAuth"
import { ReactNode } from "react"

type ClientWrapperProps = {
    children: ReactNode;
    requiresAuth: boolean;
}

const AuthtWrapper = ({children, requiresAuth}:ClientWrapperProps) => {
    const AuthWrapperComponent = withAuth(() => <>{children}</>,requiresAuth)
    return <AuthWrapperComponent />
}

export default AuthtWrapper