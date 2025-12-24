import { IBaseViewModelWithTenantDto } from '@/shared/domain/interfaces/base-view-model-with-tenant-dto.interface';

export interface IStorageCreateViewModelDto
  extends IBaseViewModelWithTenantDto {
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: string;
  url: string;
  path: string;
}
