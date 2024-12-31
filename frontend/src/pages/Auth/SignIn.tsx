import { useCookies } from 'react-cookie'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import { useFormik } from 'formik'

import { ACCESS_TOKEN } from '@constants/cookie'
import { BASE_PATH, SIGN_UP_PATH } from '@constants/routes'

import { LOGIN } from '@gql/auth'

import { useMutation } from '@apollo/client'

interface LoginInput {
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
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md rounded-lg border border-white/20  p-8 text-black shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-white">Sign In</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              className="w-full rounded-md px-3 py-2 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
          </div>
          {formik.touched.username && formik.errors.username ? (
            <p className="text-sm text-red-500">{formik.errors.username}</p>
          ) : null}

          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="w-full rounded-md px-3 py-2 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </div>
          {formik.touched.password && formik.errors.password ? (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          ) : null}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full rounded-lg bg-primary-600 py-2 text-white transition duration-200 hover:bg-primary-700 ${formik.isSubmitting ? 'opacity-50' : ''}`}
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-white">
          <span className="mr-2">Don&apos;t have an account?</span>
          <Link className="text-primary-500 transition-colors duration-200 hover:text-primary-600" to={SIGN_UP_PATH}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn
