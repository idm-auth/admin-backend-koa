export const updatedAtMiddleware = function (this: any, next: () => void) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && !Array.isArray(update)) {
    (update as Record<string, unknown>).updatedAt = new Date();
  }
  next();
};