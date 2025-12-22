import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantMemberReadRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantMemberRemovedEventHandler } from './tenant-member-deleted.event-handler';

describe('TenantMemberRemovedEventHandler', () => {
  let handler: TenantMemberRemovedEventHandler;
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

    handler = new TenantMemberRemovedEventHandler(
      mockTenantMemberReadRepository,
      mockAssertTenantMemberViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete tenant member view model when event is handled', async () => {
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

      const event = new TenantMemberRemovedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberRemovedEvent',
        },
        {
          id: tenantMemberId,
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt: now,
          updatedAt: now,
        },
      );

      mockAssertTenantMemberViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockTenantMemberReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertTenantMemberViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantMemberId);
      expect(mockTenantMemberReadRepository.delete).toHaveBeenCalledWith(
        existingViewModel.id,
      );
      expect(mockTenantMemberReadRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should delete view model after asserting it exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const existingViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.ADMIN,
        createdAt: now,
        updatedAt: now,
      });

      const event = new TenantMemberRemovedEvent(
        {
          aggregateId: tenantMemberId,
          aggregateType: 'TenantMemberAggregate',
          eventType: 'TenantMemberRemovedEvent',
        },
        {
          id: tenantMemberId,
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
      mockTenantMemberReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      const assertOrder =
        mockAssertTenantMemberViewModelExsistsService.execute.mock
          .invocationCallOrder[0];
      const deleteOrder =
        mockTenantMemberReadRepository.delete.mock.invocationCallOrder[0];
      expect(assertOrder).toBeLessThan(deleteOrder);
    });
  });
});
