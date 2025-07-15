import { useForm } from 'react-hook-form'

import { useAuth } from '@/context/AuthContext'
import type { TUser } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  type LoginFormInputs,
  loginFormSchema,
} from '@/components/Forms/zod-form-schemas'
import Text from '@/components/Text'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { usePushNotification } from '@/hooks/usePushNotification'

const LoginForm = () => {
  const { login } = useAuth()
  const { showSuccessToast } = usePushNotification()

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleAutoFill = () => {
    form.setValue('email', import.meta.env.VITE_TEST_USER_EMAIL || '')
    form.setValue('password', import.meta.env.VITE_TEST_USER_PASSWORD || '')
  }

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )

      const responseData = await response.json()

      if (response.ok) {
        const { token, user } = responseData
        login(token, user as TUser)

        // Success message and redirect.
        showSuccessToast({
          title: 'Login OK',
          description: 'Redirecting to homepage...',
          redirectPath: '/',
          redirectDelay: 3000,
        })

        form.reset()
      } else {
        const errorMessage =
          responseData.message || 'Login failed. Please check your credentials.'
        form.setError('password', {
          type: 'manual',
          message: errorMessage,
        })
        form.setError('root.apiError', {
          type: 'manual',
          message: 'An error occurred during login. Please try again.',
        })
      }
    } catch (error) {
      console.error('An unexpected error occurred during login:', error)
      form.setError('root.apiError', {
        type: 'manual',
        message:
          'A network error occurred. Please check your connection or try again.',
      })
    }
  }

  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 border rounded-lg shadow-sm"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  {...field}
                  type="email"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  type="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.apiError && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.root.apiError.message}
          </p>
        )}

        <div className="flex space-x-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            type="button"
            onClick={handleAutoFill}
            className="w-full"
            disabled={isSubmitting}
            variant="outline"
          >
            Autofill *
          </Button>
        </div>

        <Text color="muted">
          * Autofill is a feature to help in dev and tests. It would not be
          available in production.
        </Text>
      </form>
    </Form>
  )
}

export default LoginForm
