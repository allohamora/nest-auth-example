import { Injectable } from '@nestjs/common';
import { scrypt as scryptCallback, randomBytes } from 'crypto';
import { promisify } from 'util';

const SALT_LEN = 8;
const KEY_LEN = 64;

const scrypt = promisify(scryptCallback);

@Injectable()
export class CryptoService {
  private serializeHash(hash: string, salt: string) {
    return `${salt}:${hash}`;
  }

  private deserializeHash(serializedHash: string) {
    return serializedHash.split(':');
  }

  public async scryptHash(data: string) {
    const salt = randomBytes(SALT_LEN).toString('hex');
    const hash = ((await scrypt(data, salt, KEY_LEN)) as Buffer).toString('hex');
    const serialized = this.serializeHash(hash, salt);

    return serialized;
  }

  public async scryptVerify(data: string, hash: string) {
    const [salt, oldHash] = this.deserializeHash(hash);
    const newHash = ((await scrypt(data, salt, KEY_LEN)) as Buffer).toString('hex');

    return newHash === oldHash;
  }
}
