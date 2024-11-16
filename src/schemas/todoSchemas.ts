// schemas/userSchema.ts
import { z } from 'zod'

export const addTodoSchema = z.object({
  subject: z.string().min(1, 'Required')
})

export const editTodoSchema = z.object({
  tempSubject: z.string().min(1, 'Required')
})
