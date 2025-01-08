import React, { createContext, useContext } from 'react'

export interface AuthInfo {
  id: string
  username: string
  createdAt: string
}

export interface AuthContextProps {
  auth: AuthInfo | null
  setAuth: React.Dispatch<React.SetStateAction<AuthInfo | null>>
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
