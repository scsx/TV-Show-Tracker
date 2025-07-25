import { type UseFormReturn } from 'react-hook-form'

import { type RegisterFormInputs } from '@/components/AuthForms/zod-form-schemas'
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

type RegisterFormUIProps = {
  form: UseFormReturn<RegisterFormInputs>
  onSubmit: (data: RegisterFormInputs) => void
  handleAutoFill: () => void
  isSubmitting: boolean
}

const RegisterFormUI: React.FC<RegisterFormUIProps> = ({
  form,
  onSubmit,
  handleAutoFill,
  isSubmitting,
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 border rounded-lg shadow-sm"
      >
        {/* Username */}
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

        {/* Email */}
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

export default RegisterFormUI
