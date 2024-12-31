import React, { createContext, useContext } from 'react'

export interface UserProfile {
  id: string
  username: string
  createdAt: string
}

export interface UserProfileContextProps {
  userProfile: UserProfile | null
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined)

export const useUserProfile = (): UserProfileContextProps => {
  const context = useContext(UserProfileContext)
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
