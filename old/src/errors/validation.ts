export class ValidationError extends Error {
  public fields?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    fields?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
