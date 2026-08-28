import fs from 'fs/promises';
import path from 'path';

import os from 'os';

const UPLOAD_DIR = path.join(os.homedir(), '.checkin-me-uploads');

export async function ensureDir(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function uploadLocalFile(fileName: string, buffer: Buffer): Promise<{ error: any }> {
  try {
    const fullPath = path.join(UPLOAD_DIR, fileName);
    const dir = path.dirname(fullPath);
    await ensureDir(dir);
    await fs.writeFile(fullPath, buffer);
    return { error: null };
  } catch (error) {
    console.error('Failed to upload local file:', error);
    return { error };
  }
}

export async function deleteLocalFiles(fileNames: string[]): Promise<{ error: any }> {
  try {
    for (const fileName of fileNames) {
      const fullPath = path.join(UPLOAD_DIR, fileName);
      try {
        await fs.unlink(fullPath);
      } catch (err: any) {
        // Ignore if file doesn't exist
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }
    return { error: null };
  } catch (error) {
    console.error('Failed to delete local files:', error);
    return { error };
  }
}

export async function getLocalFileBuffer(fileName: string): Promise<{ data: ArrayBuffer | null; error: any }> {
  try {
    const fullPath = path.join(UPLOAD_DIR, fileName);
    const buffer = await fs.readFile(fullPath);
    // Convert Node Buffer to standard ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    return { data: arrayBuffer, error: null };
  } catch (error: any) {
    // Return null data if file not found
    if (error.code === 'ENOENT') {
      return { data: null, error };
    }
    console.error('Failed to read local file:', error);
    return { data: null, error };
  }
}

export function getLocalPublicUrl(fileName: string): string {
  // Since we serve files through our own API routes, we don't return a direct file URL.
  // The client side logic already constructs URLs like `/api/images/${path}` or `/api/pdf/${path}`.
  // For property media, we might need a dedicated route if they were served directly.
  return `/api/images/${fileName}`; // Defaulting to the images route which we will update
}
