import * as logger from "firebase-functions/logger";

export function log(message: any) {
  logger.info(message, { structuredData: true });
}

export function error(message: any) {
  logger.error(message, { structuredData: true });
}

export function warn(message: any) {
  logger.warn(message, { structuredData: true });
}
