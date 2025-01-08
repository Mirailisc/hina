import { FormikProps } from 'formik'

import { LoginInput } from '@/pages/Auth/SignIn'

type Props = {
  formik: FormikProps<LoginInput>
}

const SignInForm: React.FC<Props> = ({ formik }: Props) => {
  return (
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
  )
}

export default SignInForm
