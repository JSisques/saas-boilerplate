import { SetMetadata } from '@nestjs/common';
import { Public } from '@/auth-context/auth/infrastructure/decorators/public/public.decorator';
import { IS_PUBLIC_KEY } from '@/auth-context/auth/infrastructure/decorators/public/public.decorator';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(),
}));

describe('Public', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call SetMetadata with IS_PUBLIC_KEY and true', () => {
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    Public();

    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
    expect(SetMetadata).toHaveBeenCalledTimes(1);
  });

  it('should return a decorator function', () => {
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    const result = Public();

    expect(typeof result).toBe('function');
  });
});
