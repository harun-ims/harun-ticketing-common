import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../errors/catch-async';
import { UnauthorizedException } from '../errors/api-error';
import { RequestUserPayload } from '../types/RequestExtension';
import { getEnvVariable } from '../utils/env-variable';
import '../types/RequestExtension';

export const checkAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Getting token from cookies or request header
  const accessToken: string | null = req.cookies?.__at__ || req.header('x-auth-access-token');
  if (!accessToken) return next();

  // Verify access token
  try {
    const decoded = jwt.verify(accessToken, getEnvVariable('ACCESS_TOKEN_SECRET_KEY')) as RequestUserPayload;
    req.user = decoded;
  } catch (err) {}

  next();
});

export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new UnauthorizedException());

  next();
});
