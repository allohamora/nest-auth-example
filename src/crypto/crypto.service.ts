import { Injectable } from '@nestjs/common';
import { scrypt as scryptCallback, randomBytes } from 'crypto';
import { promisify } from 'util';

const SALT_LENGTH = 8;
const KEY_LENGTH = 64;

const scrypt = promisify(scryptCallback);

@Injectable()
export class CryptoService {
  private serializeHash(hash: string, salt: string) {
    return `${salt}:${hash}`;
  }

  private deserializeHash(serializedHash: string) {
    return serializedHash.split(':') as [salt: string, hash: string];
  }

  public async scryptHash(input: string) {
    const salt = randomBytes(SALT_LENGTH).toString('hex');
    const hash = ((await scrypt(input, salt, KEY_LENGTH)) as Buffer).toString('hex');
    const serializedHash = this.serializeHash(hash, salt);

    return serializedHash;
  }

  public async scryptVerify(input: string, hashToCompare: string) {
    const [salt, oldHash] = this.deserializeHash(hashToCompare);
    const newHash = ((await scrypt(input, salt, KEY_LENGTH)) as Buffer).toString('hex');

    return newHash === oldHash;
  }
}
