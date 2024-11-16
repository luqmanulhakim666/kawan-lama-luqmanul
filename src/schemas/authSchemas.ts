// schemas/userSchema.ts
import { z } from 'zod'

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const userRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})
