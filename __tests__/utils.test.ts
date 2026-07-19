import { encryptId, decryptId } from '@/lib/utils';

describe('encryptId / decryptId', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  it('should encrypt and decrypt an id correctly', () => {
    const id = 'test-user-123';
    const encrypted = encryptId(id);
    const decrypted = decryptId(encrypted);
    expect(decrypted).toBe(id);
  });

  it('should produce different encrypted values for different ids', () => {
    const id1 = 'user-1';
    const id2 = 'user-2';
    expect(encryptId(id1)).not.toBe(encryptId(id2));
  });

  it('should throw on invalid encrypted id', () => {
    expect(() => decryptId('invalid-base64-value')).toThrow();
  });

  it('should throw on tampered hmac', () => {
    const id = 'user-123';
    const encrypted = encryptId(id);
    const parts = Buffer.from(encrypted, 'base64url').toString('utf-8').split(':');
    const tampered = Buffer.from(`${parts[0]}:fakehmac`).toString('base64url');
    expect(() => decryptId(tampered)).toThrow('Invalid sharable ID');
  });
});
