import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import toast from 'react-hot-toast'

import Loading from '@/pages/Loading'

import { AuthInfo, AuthContext } from '@/context/authContext'

import { ACCESS_TOKEN } from '@/constants/cookie'

import { PROFILE } from '@/gql/auth'

import { useQuery } from '@apollo/client'

type Props = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }: Props) => {
  const [cookies, , removeCookie] = useCookies([ACCESS_TOKEN])
  const [auth, setAuth] = useState<AuthInfo | null>(null)

  const { data, loading, error } = useQuery(PROFILE, {
    skip: !cookies[ACCESS_TOKEN],
  })

  useEffect(() => {
    if (data?.profile) {
      setAuth(data.profile)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
      if (error.message.includes('Unauthorized')) {
        removeCookie(ACCESS_TOKEN, { path: '/' })
      }
    }
  }, [error, removeCookie])

  if (loading) return <Loading />

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}
