import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // Store decoded token payload on `req.user`
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' })
  }
}
