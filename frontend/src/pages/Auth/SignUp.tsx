import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useFormik } from 'formik'

import { SIGN_IN_PATH } from '@constants/routes'

import { REGISTER } from '@gql/auth'

import { useMutation } from '@apollo/client'

// Ensure to define this in your GraphQL schema

interface RegisterInput {
  username: string
  password: string
  confirmPassword: string
}

const SignUp: React.FC = (): JSX.Element => {
  const navigate = useNavigate()
  const [registerUser] = useMutation(REGISTER)

  const validate = (values: RegisterInput) => {
    const errors: Partial<RegisterInput> = {}

    if (!values.username) {
      errors.username = 'Username is required'
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long'
    }

    if (!values.password) {
      errors.password = 'Password is required'
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required'
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate,
    onSubmit: async (values: RegisterInput, { resetForm }) => {
      try {
        await registerUser({ variables: { input: values } })
        resetForm()
        toast.success('Registration successful')
        navigate(SIGN_IN_PATH, { replace: true })
      } catch (err) {
        toast.error('Registration failed: ' + err)
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md rounded-lg border border-white/20  p-8 text-black shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-white">Sign Up</h2>
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

          <div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-md px-3 py-2 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
          ) : null}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full rounded-lg bg-primary-600 py-2 text-white transition duration-200 hover:bg-primary-700 ${formik.isSubmitting ? 'opacity-50' : ''}`}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-white">
          <span className="mr-2">Already have an account?</span>
          <Link className="text-primary-500 transition-colors duration-200 hover:text-primary-600" to={SIGN_IN_PATH}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
