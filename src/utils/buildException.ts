export const buildException = (error: Error, message: string, meta?: Record<string, any>) => {
  return {
    error,
    message,
    ...(meta && { meta }),
  };
};
