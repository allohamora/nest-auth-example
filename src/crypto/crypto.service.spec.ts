import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('scryptHash should return hashed string', async () => {
    expect(typeof (await service.scryptHash('test'))).toBe('string');
  });

  test('scryptVerify should verify non hashed string with hashed', async () => {
    const input = 'test';
    const hashed = await service.scryptHash(input);

    expect(await service.scryptVerify(input, hashed)).toBe(true);
    expect(await service.scryptVerify('123', hashed)).toBe(false);
    expect(await service.scryptVerify('123', '123:123')).toBe(false);
  });
});
