import 'server-only';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Helper to get the encryption key as a Buffer.
 * Lazily initialized to avoid top-level execution of Node.js logic and env access.
 */
let cachedKeyBuffer: Buffer | null = null;

function getKeyBuffer(): Buffer {
  if (cachedKeyBuffer) return cachedKeyBuffer;
  
  const KEY = process.env.ENCRYPTION_KEY;
  if (!KEY) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables');
  }

  const buf = Buffer.from(KEY, 'base64');
  if (buf.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte base64 string');
  }
  
  cachedKeyBuffer = buf;
  return buf;
}

/**
 * Encrypts a buffer using AES-256-GCM.
 * The result is [IV(12 bytes)][AuthTag(16 bytes)][Ciphertext].
 */
export function encrypt(data: Buffer): Buffer {
  const key = getKeyBuffer();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([iv, tag, encrypted]);
}

/**
 * Decrypts a buffer encrypted by the above function.
 */
export function decrypt(data: Buffer): Buffer {
  if (data.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error('Encrypted data is too short');
  }

  const key = getKeyBuffer();
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
