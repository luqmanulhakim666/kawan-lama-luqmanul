import express, { Request, Response, NextFunction } from 'express'
import prisma from '../prismaClient'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Add new To-Do
router.post('/', authMiddleware, async (req: any, res: Response) => {
  console.log(req)
  const { subject, description } = req.body

  try {
    // Find the latest todo with the highest activityNo
    const latestTodo = await prisma.toDo.findFirst({
      orderBy: {
        activityNo: 'desc'
      },
      where: {
        activityNo: {
          startsWith: 'AC-'
        }
      }
    })

    // If there's an existing todo, increment the number part of the activityNo
    let activityNo = 'AC-0001'
    if (latestTodo) {
      const latestActivityNo = latestTodo.activityNo
      const numericPart = parseInt(latestActivityNo.replace('AC-', ''), 10)
      const newNumericPart = numericPart + 1
      // Format the number to have leading zeros (e.g., 1 -> 0001)
      activityNo = `AC-${newNumericPart.toString().padStart(4, '0')}`
    }

    // Create the new todo item with the incremented activityNo
    const todo = await prisma.toDo.create({
      data: {
        subject,
        description,
        activityNo,
        userId: req.user?.userId
      }
    })

    res.json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Error adding to-do item' })
  }
})

// Edit To-Do
router.put('/:id', authMiddleware, async (req: any, res: Response) => {
  const { subject, description, status } = req.body
  try {
    const todo = await prisma.toDo.update({
      where: { id: req.params.id },
      data: { subject, description, status }
    })
    res.json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Error updating to-do item' })
  }
})

// Delete To-Do
router.delete('/:id', authMiddleware, async (req: any, res: Response) => {
  try {
    await prisma.toDo.delete({ where: { id: req.params.id } })
    res.json({ message: 'To-Do item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting to-do item' })
  }
})

// Get User's To-Do List
router.get('/', authMiddleware, async (req: any, res: Response) => {
  try {
    const todos = await prisma.toDo.findMany({
      where: { userId: req.userId },
      orderBy: {
        activityNo: 'asc'
      }
    })
    res.json(todos)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching to-do list' })
  }
})

export default router
