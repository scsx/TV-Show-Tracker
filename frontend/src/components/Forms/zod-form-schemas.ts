import { z } from 'zod'

// Registration form.
export const registerFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required.' })
    .min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email('Invalid email address.'),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
})

// Login form.
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
})

// Infer the TypeScript type from the schema.
export type RegisterFormInputs = z.infer<typeof registerFormSchema>
export type LoginFormInputs = z.infer<typeof loginFormSchema>
