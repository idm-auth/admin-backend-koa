export const updatedAtMiddleware = function (
  this: { getUpdate: () => unknown },
  next: () => void
) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && !Array.isArray(update)) {
    (update as Record<string, unknown>).updatedAt = new Date();
  }
  next();
};
