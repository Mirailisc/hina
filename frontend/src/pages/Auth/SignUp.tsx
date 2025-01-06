import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useFormik } from 'formik'

import SignUpForm from '@components/Auth/SignUpForm'

import { SIGN_IN_PATH } from '@constants/routes'

import { REGISTER } from '@gql/auth'

import { useMutation } from '@apollo/client'

export interface RegisterInput {
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
    <div className="flex min-h-[70vh] items-center justify-center ">
      <div className="w-full max-w-md rounded-lg border border-white/20  p-8 text-black shadow-lg">
        <h2 className="mb-10 text-center text-2xl font-semibold text-white sm:text-left sm:text-4xl">Create an account</h2>
        <SignUpForm formik={formik} />
        <div className="mt-10 text-center text-white">
          <span className="mr-2">Already have an account?</span>
          <Link className="text-primary-500 transition-colors duration-200 hover:text-primary-600" to={SIGN_IN_PATH}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
