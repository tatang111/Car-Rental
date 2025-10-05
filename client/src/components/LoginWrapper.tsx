"use client"

import { useAuthStore } from "@/app/store/useAuthStore"
import Login from "./Login"

const LoginWrapper = () => {
    const { showLogin } = useAuthStore()

    return showLogin ? <Login /> : null
}

export default LoginWrapper
