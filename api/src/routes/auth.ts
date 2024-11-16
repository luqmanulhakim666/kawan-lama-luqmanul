import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient'
import { authMiddleware } from '../middleware/auth'

declare module 'express' {
  export interface Request {
    user?: { id: string }
  }
}

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })
    res.json(user) // Send the response here directly
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error registering user' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const body = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email: body.email } })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(body.password, user.password)
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '24h'
    })

    const { password, ...userResult } = user

    return res.json({ user: userResult, token: token })
  } catch (error) {
    return res.status(500).json({ error: 'Error logging in' })
  }
})

// Get Me

// Protected GET route
router.get('/me', authMiddleware, async (req: any, res: any) => {
  console.log(req.user)
  try {
    const userId = req.user?.userId
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in request.' })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    const { password, ...resUser } = user
    res.json(resUser)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Failed to fetch user profile.' })
  }
})

// Logout
router.post('/logout', (req: Request, res: Response): void => {
  res.json({ message: 'Logout successful' })
})

export default router
