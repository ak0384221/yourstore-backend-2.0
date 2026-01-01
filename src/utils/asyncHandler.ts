import type { NextFunction, Request, Response } from "express";

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
      res
        .status(err.code || 500)
        .json({ success: false, message: err.message });
    }
  };
}

export { asyncHandler };
