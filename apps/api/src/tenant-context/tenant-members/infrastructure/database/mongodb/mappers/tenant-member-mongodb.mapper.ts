import { TenantMemberViewModelFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-view-model.factory';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member.view-model';
import { TenantMemberMongoDbDto } from '@/tenant-context/tenant-members/infrastructure/database/mongodb/dtos/tenant-member-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantMemberMongoDBMapper {
  private readonly logger = new Logger(TenantMemberMongoDBMapper.name);

  constructor(
    private readonly tenantMemberViewModelFactory: TenantMemberViewModelFactory,
  ) {}
  /**
   * Converts a MongoDB document to a tenant member view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The tenant member view model
   */
  public toViewModel(doc: TenantMemberMongoDbDto): TenantMemberViewModel {
    this.logger.log(
      `Converting MongoDB document to tenant member view model with id ${doc.id}`,
    );

    return this.tenantMemberViewModelFactory.create({
      id: doc.id,
      tenantId: doc.tenantId,
      userId: doc.userId,
      role: doc.role,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a tenant member view model to a MongoDB document
   *
   * @param tenantMemberViewModel - The tenant member view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(
    tenantMemberViewModel: TenantMemberViewModel,
  ): TenantMemberMongoDbDto {
    this.logger.log(
      `Converting tenant member view model with id ${tenantMemberViewModel.id} to MongoDB document`,
    );

    return {
      id: tenantMemberViewModel.id,
      tenantId: tenantMemberViewModel.tenantId,
      userId: tenantMemberViewModel.userId,
      role: tenantMemberViewModel.role,
      createdAt: tenantMemberViewModel.createdAt,
      updatedAt: tenantMemberViewModel.updatedAt,
    };
  }
}
