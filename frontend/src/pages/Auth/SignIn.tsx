import { useCookies } from 'react-cookie'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import { useFormik } from 'formik'

import SignInForm from '@components/Auth/SignInForm'

import { ACCESS_TOKEN } from '@constants/cookie'
import { BASE_PATH, SIGN_UP_PATH } from '@constants/routes'

import { LOGIN } from '@gql/auth'

import { useMutation } from '@apollo/client'

export interface LoginInput {
  username: string
  password: string
}

const SignIn: React.FC = (): JSX.Element => {
  const [, setCookie] = useCookies([ACCESS_TOKEN])
  const [loginUser] = useMutation(LOGIN)

  const navigate = useNavigate()

  const validate = (values: LoginInput) => {
    const errors: Partial<LoginInput> = {}

    if (!values.username) {
      errors.username = 'Username is required'
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long'
    }

    if (!values.password) {
      errors.password = 'Password is required'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate,
    onSubmit: async (values: LoginInput, { resetForm }) => {
      try {
        const { data } = await loginUser({ variables: { username: values.username, password: values.password } })
        resetForm()
        toast.success('Login successful')

        if (data?.login) {
          const expires = new Date()
          expires.setDate(expires.getDate() + 1)

          setCookie(ACCESS_TOKEN, data.login, { path: '/', expires })

          navigate(BASE_PATH, { replace: true })
          navigate(0)
        }
      } catch (err) {
        toast.error('Login failed: ' + err)
      }
    },
  })

  return (
    <div className="flex min-h-[70vh] items-center justify-center ">
      <div className="w-full max-w-md rounded-lg border border-white/20  p-6 text-black shadow-lg">
        <h2 className="mb-10 text-center text-2xl font-semibold text-white sm:text-left sm:text-4xl">Login</h2>
        <SignInForm formik={formik} />
        <div className="mt-10 text-center text-white">
          <span className="mr-2">Don&apos;t have an account?</span>
          <Link className="text-primary-500 transition-colors duration-200 hover:text-primary-600" to={SIGN_UP_PATH}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn
