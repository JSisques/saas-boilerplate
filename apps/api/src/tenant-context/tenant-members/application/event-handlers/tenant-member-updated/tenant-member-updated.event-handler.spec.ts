import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberReadRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantMemberUpdatedEventHandler } from './tenant-member-updated.event-handler';

describe('TenantMemberUpdatedEventHandler', () => {
  let handler: TenantMemberUpdatedEventHandler;
  let mockTenantMemberReadRepository: jest.Mocked<TenantMemberReadRepository>;
  let mockAssertTenantMemberViewModelExsistsService: jest.Mocked<AssertTenantMemberViewModelExsistsService>;

  beforeEach(() => {
    mockTenantMemberReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberReadRepository>;

    mockAssertTenantMemberViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantMemberViewModelExsistsService>;

    handler = new TenantMemberUpdatedEventHandler(
      mockTenantMemberReadRepository,
      mockAssertTenantMemberViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save tenant member view model when event is handled', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const existingViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });

      const event = new TenantMemberUpdatedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberUpdatedEvent',
        },
        {
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.ADMIN,
          createdAt: now,
          updatedAt: now,
        },
      );

      mockAssertTenantMemberViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockTenantMemberReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertTenantMemberViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantMemberId);
      expect(existingViewModel.role).toBe(TenantMemberRoleEnum.ADMIN);
      expect(mockTenantMemberReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
    });

    it('should update view model with new role from event data', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const existingViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });

      const event = new TenantMemberUpdatedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberUpdatedEvent',
        },
        {
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.OWNER,
          createdAt: now,
          updatedAt: now,
        },
      );

      mockAssertTenantMemberViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockTenantMemberReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(existingViewModel.role).toBe(TenantMemberRoleEnum.OWNER);
    });

    it('should save view model after updating it', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const existingViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });

      const event = new TenantMemberUpdatedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberUpdatedEvent',
        },
        {
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.GUEST,
          createdAt: now,
          updatedAt: now,
        },
      );

      mockAssertTenantMemberViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockTenantMemberReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const updateOrder =
        mockAssertTenantMemberViewModelExsistsService.execute.mock
          .invocationCallOrder[0];
      const saveOrder =
        mockTenantMemberReadRepository.save.mock.invocationCallOrder[0];
      expect(updateOrder).toBeLessThan(saveOrder);
    });
  });
});
