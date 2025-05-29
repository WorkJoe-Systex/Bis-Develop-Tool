import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  statusCode?: number
  details?: any
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500

  console.error(`[ERROR] ${req.method} ${req.originalUrl}`)
  console.error(err.stack)

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    ...(err.details && { details: err.details })
  })
}
