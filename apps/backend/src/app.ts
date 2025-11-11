import express, { Application, NextFunction, Request, Response } from 'express';
import errorHandler from './middleware/globalErrorHandler.middleware.js';
import cookieParser from 'cookie-parser';
import { ApiError } from '@repo/utils';

const app: Application = express();

app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Import and use routes
import authRoute from './routes/auth.routes.js';
app.use('/api/v1/auth', authRoute);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route Not Found'));
});

app.use(errorHandler);
export default app;
