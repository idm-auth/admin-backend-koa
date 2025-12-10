export class UnauthorizedError extends Error {
  public readonly statusCode = 401;

  constructor(
    message: string = 'Unauthorized',
    options?: { cause?: Error | null }
  ) {
    super(message, options);
    this.name = 'UnauthorizedError';
  }
}
