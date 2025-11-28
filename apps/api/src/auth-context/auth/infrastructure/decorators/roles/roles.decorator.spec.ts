import {
  Roles,
  ROLES_KEY,
} from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { UserRoleEnum } from '@/prisma/master/client';
import { SetMetadata } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(),
}));

describe('Roles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call SetMetadata with ROLES_KEY and provided roles', () => {
    const roles = [UserRoleEnum.ADMIN, UserRoleEnum.USER];
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    Roles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
    expect(SetMetadata).toHaveBeenCalledTimes(1);
  });

  it('should work with single role', () => {
    const role = UserRoleEnum.ADMIN;
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    Roles(role);

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [role]);
  });

  it('should work with multiple roles', () => {
    const roles = [UserRoleEnum.ADMIN, UserRoleEnum.USER];
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    Roles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });

  it('should work with empty roles array', () => {
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    Roles();

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, []);
  });
});
