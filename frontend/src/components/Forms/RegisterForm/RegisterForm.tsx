import { useForm } from 'react-hook-form'

import { useAuth } from '@/context/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'

import RegisterFormUI from '@/components/Forms/RegisterForm/RegisterFormUI'
import {
  type RegisterFormInputs,
  registerFormSchema,
} from '@/components/Forms/zod-form-schemas'

import { usePushNotification } from '@/hooks/usePushNotification'

const RegisterForm = () => {
  const { login } = useAuth()
  const { showSuccessToast } = usePushNotification()

  // Initialize useForm with the imported schema and resolver.
  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  // Dev function to autofill the form.
  const handleAutoFill = () => {
    const uniqueId = Date.now().toString().slice(-5)
    form.setValue('username', `tester${uniqueId}`)
    form.setValue('email', `tester${uniqueId}@example.com`)
    form.setValue('password', 'password123')

    form.trigger(['username', 'email', 'password'])
  }

  // Define the onSubmit function
  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        },
      )

      const result = await response.json()

      if (response.ok) {
        console.log('Registration successful!', result)
        // Login and save token.
        if (result.token && result.user) {
          login(result.token, result.user)
          console.log('Token and user data saved successfully.')
        } else {
          console.warn(
            'Registration successful but token or user data missing from response.',
          )
        }

        // Success message and redirect.
        showSuccessToast({
          title: 'Registration and login OK',
          description: 'Redirecting to homepage...',
          redirectPath: '/',
          redirectDelay: 3000,
        })

        form.reset()
      } else {
        console.error('Registration failed:', result.msg)
        if (result.msg && result.msg.includes('email already exists')) {
          form.setError('email', {
            type: 'manual',
            message: result.msg,
          })
        } else if (
          result.msg &&
          result.msg.includes('Username already taken')
        ) {
          form.setError('username', {
            type: 'manual',
            message: result.msg,
          })
        } else {
          form.setError('root.apiError', {
            type: 'manual',
            message: result.msg || 'Registration failed. Please try again.',
          })
        }
      }
    } catch (error) {
      console.error('Network or unknown error during registration:', error)
      form.setError('root.apiError', {
        type: 'manual',
        message:
          'Could not connect to the server. Please check your connection.',
      })
    }
  }

  // Get form submission status for button loading state.
  const { isSubmitting } = form.formState

  return (
    <RegisterFormUI
      form={form}
      onSubmit={onSubmit}
      handleAutoFill={handleAutoFill}
      isSubmitting={isSubmitting}
    />
  )
}

export default RegisterForm
