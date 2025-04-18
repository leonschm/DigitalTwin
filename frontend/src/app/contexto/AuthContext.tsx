"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type User from "@core/user/User"

type AuthContextType = {
	user: User | null
	setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider")
	return context
}
