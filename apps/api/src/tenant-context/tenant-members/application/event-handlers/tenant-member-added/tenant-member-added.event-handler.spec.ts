import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { TenantMemberViewModelFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-view-model/tenant-member-view-model.factory';
import { TenantMemberPrimitives } from '@/tenant-context/tenant-members/domain/primitives/tenant-member.primitives';
import { TenantMemberReadRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantMemberAddedEventHandler } from './tenant-member-added.event-handler';

describe('TenantMemberAddedEventHandler', () => {
  let handler: TenantMemberAddedEventHandler;
  let mockTenantMemberReadRepository: jest.Mocked<TenantMemberReadRepository>;
  let mockTenantMemberViewModelFactory: jest.Mocked<TenantMemberViewModelFactory>;

  beforeEach(() => {
    mockTenantMemberReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberReadRepository>;

    mockTenantMemberViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberViewModelFactory>;

    handler = new TenantMemberAddedEventHandler(
      mockTenantMemberReadRepository,
      mockTenantMemberViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save tenant member view model when event is handled', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantMemberPrimitives: TenantMemberPrimitives = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new TenantMemberAddedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberAddedEvent',
        },
        tenantMemberPrimitives,
      );

      const now = new Date();
      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: tenantMemberPrimitives.tenantId,
        userId: tenantMemberPrimitives.userId,
        role: tenantMemberPrimitives.role,
        createdAt: now,
        updatedAt: now,
      });

      mockTenantMemberViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockTenantMemberReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockTenantMemberViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(tenantMemberPrimitives);
      expect(
        mockTenantMemberViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
      expect(mockTenantMemberReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
      expect(mockTenantMemberReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with all tenant member properties', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantMemberPrimitives: TenantMemberPrimitives = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new TenantMemberAddedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberAddedEvent',
        },
        tenantMemberPrimitives,
      );

      const now = new Date();
      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: tenantMemberPrimitives.tenantId,
        userId: tenantMemberPrimitives.userId,
        role: tenantMemberPrimitives.role,
        createdAt: now,
        updatedAt: now,
      });

      mockTenantMemberViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockTenantMemberReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockTenantMemberViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(tenantMemberPrimitives);
      expect(mockTenantMemberReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
    });

    it('should save view model after creating it', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantMemberPrimitives: TenantMemberPrimitives = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.OWNER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new TenantMemberAddedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberAddedEvent',
        },
        tenantMemberPrimitives,
      );

      const now = new Date();
      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: tenantMemberPrimitives.tenantId,
        userId: tenantMemberPrimitives.userId,
        role: tenantMemberPrimitives.role,
        createdAt: now,
        updatedAt: now,
      });

      mockTenantMemberViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockTenantMemberReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const createOrder =
        mockTenantMemberViewModelFactory.fromPrimitives.mock
          .invocationCallOrder[0];
      const saveOrder =
        mockTenantMemberReadRepository.save.mock.invocationCallOrder[0];
      expect(createOrder).toBeLessThan(saveOrder);
    });
  });
});
