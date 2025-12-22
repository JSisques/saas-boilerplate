import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { ITenantMemberCreateViewModelDto } from '@/tenant-context/tenant-members/domain/dtos/view-models/tenant-member-create/tenant-member-create-view-model.dto';
import { TenantMemberViewModelFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-view-model/tenant-member-view-model.factory';
import { TenantMemberPrimitives } from '@/tenant-context/tenant-members/domain/primitives/tenant-member.primitives';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';

describe('TenantMemberViewModelFactory', () => {
  let factory: TenantMemberViewModelFactory;

  beforeEach(() => {
    factory = new TenantMemberViewModelFactory();
  });

  describe('create', () => {
    it('should create a TenantMemberViewModel from a DTO with all fields', () => {
      const now = new Date();

      const dto: ITenantMemberCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(TenantMemberViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.tenantId).toBe(dto.tenantId);
      expect(viewModel.userId).toBe(dto.userId);
      expect(viewModel.role).toBe(dto.role);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
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
        const dto: ITenantMemberCreateViewModelDto = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
          createdAt: now,
          updatedAt: now,
        };

        const viewModel = factory.create(dto);

        expect(viewModel.role).toBe(role);
      });
    });
  });

  describe('fromPrimitives', () => {
    it('should create a TenantMemberViewModel from primitives with all fields', () => {
      const now = new Date();

      const primitives: TenantMemberPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(TenantMemberViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.tenantId).toBe(primitives.tenantId);
      expect(viewModel.userId).toBe(primitives.userId);
      expect(viewModel.role).toBe(primitives.role);
      expect(viewModel.createdAt).toBe(primitives.createdAt);
      expect(viewModel.updatedAt).toBe(primitives.updatedAt);
    });

    it('should set createdAt and updatedAt correctly from primitives', () => {
      const now = new Date();

      const primitives: TenantMemberPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.ADMIN,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(now.getTime());
      expect(viewModel.updatedAt.getTime()).toBe(now.getTime());
    });

    it('should handle different role values from primitives', () => {
      const now = new Date();
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const primitives: TenantMemberPrimitives = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
          createdAt: now,
          updatedAt: now,
        };

        const viewModel = factory.fromPrimitives(primitives);

        expect(viewModel.role).toBe(role);
      });
    });
  });

  describe('fromAggregate', () => {
    it('should create a TenantMemberViewModel from aggregate with all fields', () => {
      const now = new Date();

      const aggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(TenantMemberViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.tenantId).toBe(aggregate.tenantId.value);
      expect(viewModel.userId).toBe(aggregate.userId.value);
      expect(viewModel.role).toBe(aggregate.role.value);
      expect(viewModel.createdAt).toBe(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toBe(aggregate.updatedAt.value);
    });

    it('should set createdAt and updatedAt correctly from aggregate', () => {
      const now = new Date();

      const aggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(
        aggregate.createdAt.value.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBe(
        aggregate.updatedAt.value.getTime(),
      );
    });

    it('should handle different role values from aggregate', () => {
      const now = new Date();
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const aggregate = new TenantMemberAggregate(
          {
            id: new TenantMemberUuidValueObject(
              '123e4567-e89b-12d3-a456-426614174000',
            ),
            tenantId: new TenantUuidValueObject(
              '223e4567-e89b-12d3-a456-426614174000',
            ),
            userId: new UserUuidValueObject(
              '323e4567-e89b-12d3-a456-426614174000',
            ),
            role: new TenantMemberRoleValueObject(role),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        const viewModel = factory.fromAggregate(aggregate);

        expect(viewModel.role).toBe(role);
      });
    });
  });
});
