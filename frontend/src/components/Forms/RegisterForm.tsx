import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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

// 1. Define the Zod schema for registration form data.
const registerFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required.' })
    .min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.email('Invalid email address.'),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
})

// Infer the TypeScript type from the schema.
type RegisterFormInputs = z.infer<typeof registerFormSchema>

const RegisterForm = () => {
  // 2. Initialize useForm with the schema and resolver.
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

  // 3. Define the onSubmit function
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
        // TODO: Guardar o token e dados do utilizador (result.token, result.user)
        // TODO: Redirecionar para a página de login ou dashboard
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

  // Get form submission status for button loading state
  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 border rounded-lg shadow-sm"
      >
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose a username"
                  {...field}
                  type="text"
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
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

        {/* Password Field */}
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

        {/* Form errors */}
        {form.formState.errors.root?.apiError && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.root.apiError.message}
          </p>
        )}

        <div className="flex space-x-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
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
          * Autofill is a feature to help in dev and tests. It wouldn't be
          available in production.
        </Text>
      </form>
    </Form>
  )
}

export default RegisterForm
