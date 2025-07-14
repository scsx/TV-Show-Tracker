import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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

// 1. Define the Zod schema for login form data.
const loginFormSchema = z.object({
  email: z.email('Invalid email address.'),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
})

// Infer the TypeScript type from the schema.
type LoginFormInputs = z.infer<typeof loginFormSchema>

const LoginForm = () => {
  // 2. Initialize useForm with the schema and resolver.
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 3. Define the onSubmit function
  const onSubmit = async (data: LoginFormInputs) => {
    // This function will only be called if validation is successful
    console.log('Login data:', data)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate a successful login
      if (
        data.email === 'test@example.com' &&
        data.password === 'password123'
      ) {
        console.log('Login successful! Redirecting or setting auth state...')
        form.reset()
      } else {
        console.error('Login failed: Invalid email or password.')
        form.setError('password', {
          // Set a custom error for the password field
          type: 'manual',
          message: 'Invalid email or password.',
        })
      }
    } catch (error) {
      console.error('An error occurred during login:', error)
      form.setError('root.apiError', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
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
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Username : TODO</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
