import { ITenantMemberCreateViewModelDto } from '@/tenant-context/tenant-members/domain/dtos/view-models/tenant-member-create/tenant-member-create-view-model.dto';
import { ITenantMemberUpdateViewModelDto } from '@/tenant-context/tenant-members/domain/dtos/view-models/tenant-member-update/tenant-member-update-view-model.dto';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';

describe('TenantMemberViewModel', () => {
  const createProps = (): ITenantMemberCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      tenantId: '223e4567-e89b-12d3-a456-426614174000',
      userId: '323e4567-e89b-12d3-a456-426614174000',
      role: TenantMemberRoleEnum.MEMBER,
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a TenantMemberViewModel with all properties', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel).toBeInstanceOf(TenantMemberViewModel);
      expect(viewModel.id).toBe(props.id);
      expect(viewModel.tenantId).toBe(props.tenantId);
      expect(viewModel.userId).toBe(props.userId);
      expect(viewModel.role).toBe(props.role);
      expect(viewModel.createdAt).toEqual(props.createdAt);
      expect(viewModel.updatedAt).toEqual(props.updatedAt);
    });

    it('should create a TenantMemberViewModel with different roles', () => {
      const now = new Date();
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const props: ITenantMemberCreateViewModelDto = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
          createdAt: now,
          updatedAt: now,
        };

        const viewModel = new TenantMemberViewModel(props);

        expect(viewModel.role).toBe(role);
      });
    });
  });

  describe('update', () => {
    it('should update the role', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      const updateData: ITenantMemberUpdateViewModelDto = {
        role: TenantMemberRoleEnum.ADMIN,
      };

      viewModel.update(updateData);

      expect(viewModel.role).toBe(TenantMemberRoleEnum.ADMIN);
    });

    it('should update the updatedAt timestamp when role is updated', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);
      const beforeUpdate = viewModel.updatedAt.getTime();

      const updateData: ITenantMemberUpdateViewModelDto = {
        role: TenantMemberRoleEnum.OWNER,
      };

      // Update should set a new timestamp
      viewModel.update(updateData);

      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should not update role when role is undefined', () => {
      const props = createProps();
      const originalRole = props.role;
      const viewModel = new TenantMemberViewModel(props);

      const updateData: ITenantMemberUpdateViewModelDto = {};

      viewModel.update(updateData);

      expect(viewModel.role).toBe(originalRole);
    });

    it('should update updatedAt even when role is undefined', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);
      const beforeUpdate = viewModel.updatedAt.getTime();

      const updateData: ITenantMemberUpdateViewModelDto = {};

      // Update should set a new timestamp
      viewModel.update(updateData);

      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should handle multiple updates correctly', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      viewModel.update({ role: TenantMemberRoleEnum.ADMIN });
      expect(viewModel.role).toBe(TenantMemberRoleEnum.ADMIN);

      viewModel.update({ role: TenantMemberRoleEnum.OWNER });
      expect(viewModel.role).toBe(TenantMemberRoleEnum.OWNER);

      viewModel.update({ role: TenantMemberRoleEnum.GUEST });
      expect(viewModel.role).toBe(TenantMemberRoleEnum.GUEST);
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel.id).toBe(props.id);
    });

    it('should return correct tenantId', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel.tenantId).toBe(props.tenantId);
    });

    it('should return correct userId', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel.userId).toBe(props.userId);
    });

    it('should return correct role', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel.role).toBe(props.role);
    });

    it('should return correct createdAt', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel.createdAt).toEqual(props.createdAt);
    });

    it('should return correct updatedAt', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel.updatedAt).toEqual(props.updatedAt);
    });

    it('should return Date instances for createdAt and updatedAt', () => {
      const props = createProps();
      const viewModel = new TenantMemberViewModel(props);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
    });
  });
});
