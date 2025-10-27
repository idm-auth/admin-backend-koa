export class ConflictError extends Error {
  public field?: string;
  public details?: string;

  constructor(message: string, options?: { field?: string; details?: string }) {
    super(message);
    this.name = 'ConflictError';
    this.field = options?.field;
    this.details = options?.details;
  }
}