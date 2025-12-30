class ApiError extends Error {
  statusCode: number;
  errors: string[] | object[];
  data: null;
  success: boolean;

  constructor(
    statusCode: number,
    message = "somethng went wrong",
    errors: string[] | object[] = [],
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
