import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  // Optional: basic validation test
  it('should validate payload correctly', async () => {
    const payload = { sub: 1, email: 'test@example.com' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ userId: 1, email: 'test@example.com' });
  });
});