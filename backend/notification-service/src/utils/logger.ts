export const logger = {
  info: (message: string): void => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  warn: (message: string): void => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  },
  error: (message: string, error?: any): void => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error);
    }
  },
};