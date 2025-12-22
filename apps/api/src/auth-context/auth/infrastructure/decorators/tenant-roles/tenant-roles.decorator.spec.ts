import {
  TenantRoles,
  TENANT_ROLES_KEY,
} from '@/auth-context/auth/infrastructure/decorators/tenant-roles/tenant-roles.decorator';
import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { SetMetadata } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(),
}));

describe('TenantRoles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call SetMetadata with TENANT_ROLES_KEY and provided roles', () => {
    const roles = [TenantMemberRoleEnum.OWNER, TenantMemberRoleEnum.ADMIN];
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    TenantRoles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(TENANT_ROLES_KEY, roles);
    expect(SetMetadata).toHaveBeenCalledTimes(1);
  });

  it('should work with single role', () => {
    const role = TenantMemberRoleEnum.OWNER;
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    TenantRoles(role);

    expect(SetMetadata).toHaveBeenCalledWith(TENANT_ROLES_KEY, [role]);
  });

  it('should work with multiple roles', () => {
    const roles = [
      TenantMemberRoleEnum.OWNER,
      TenantMemberRoleEnum.ADMIN,
      TenantMemberRoleEnum.MEMBER,
    ];
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    TenantRoles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(TENANT_ROLES_KEY, roles);
  });

  it('should work with empty roles array', () => {
    const mockSetMetadata = SetMetadata as jest.Mock;
    mockSetMetadata.mockReturnValue(() => {});

    TenantRoles();

    expect(SetMetadata).toHaveBeenCalledWith(TENANT_ROLES_KEY, []);
  });
});
