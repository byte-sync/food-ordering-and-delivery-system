/**
 * Utility functions for generating unique IDs
 */

/**
 * Generates a UUID v4 string
 * @returns A string representing a UUID v4
 */
export function generateUUID(): string {
  // RFC4122 compliant UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generates a document ID with a prefix for better identification
 * @param prefix Optional prefix to identify document type (e.g., 'doc', 'img')
 * @returns A prefixed UUID string
 */
export function generateDocumentId(prefix: string = 'doc'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}