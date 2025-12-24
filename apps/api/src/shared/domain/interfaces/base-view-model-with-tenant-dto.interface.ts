import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Base interface for ViewModel DTOs that require tenant isolation.
 * Extends IBaseViewModelDto and adds tenantId property (optional).
 *
 * Use this interface for ViewModel DTOs that are stored in a shared database
 * but need to be filtered by tenantId. The tenantId is optional to allow
 * factories to create ViewModels without tenant context, but should be
 * provided when saving to tenant-isolated repositories.
 */
export interface IBaseViewModelWithTenantDto extends IBaseViewModelDto {
  tenantId?: string;
}
