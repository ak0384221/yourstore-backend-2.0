import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./apiError.ts";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

function asyncHandler(fn: AsyncFunction) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch (err: any) {
      throw new ApiError(err.code || 500, err.message);
    }
  };
}

export { asyncHandler };
