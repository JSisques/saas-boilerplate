import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model.factory';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantMongoDbDto } from '@/tenant-context/tenants/infrastructure/database/mongodb/dtos/tenant/tenant-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class TenantMongoDBMapper {
  private readonly logger = new Logger(TenantMongoDBMapper.name);

  constructor(
    private readonly tenantViewModelFactory: TenantViewModelFactory,
    private readonly queryBus: QueryBus,
  ) {}
  /**
   * Converts a MongoDB document to a tenant view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The tenant view model
   */
  public toViewModel(doc: TenantMongoDbDto): TenantViewModel {
    this.logger.log(
      `Converting MongoDB document to tenant view model with id ${doc.id}`,
    );

    return this.tenantViewModelFactory.create(doc);
  }

  /**
   * Converts a tenant view model to a MongoDB document
   *
   * @param tenantViewModel - The tenant view model to convert
   * @returns The MongoDB document
   */
  public async toMongoData(
    tenantViewModel: TenantViewModel,
  ): Promise<TenantMongoDbDto> {
    this.logger.log(
      `Converting tenant view model with id ${tenantViewModel.id} to MongoDB document`,
    );

    return {
      id: tenantViewModel.id,
      name: tenantViewModel.name,
      slug: tenantViewModel.slug,
      description: tenantViewModel.description,
      websiteUrl: tenantViewModel.websiteUrl,
      logoUrl: tenantViewModel.logoUrl,
      faviconUrl: tenantViewModel.faviconUrl,
      primaryColor: tenantViewModel.primaryColor,
      secondaryColor: tenantViewModel.secondaryColor,
      status: tenantViewModel.status,
      email: tenantViewModel.email,
      phoneNumber: tenantViewModel.phoneNumber,
      phoneCode: tenantViewModel.phoneCode,
      address: tenantViewModel.address,
      city: tenantViewModel.city,
      state: tenantViewModel.state,
      country: tenantViewModel.country,
      postalCode: tenantViewModel.postalCode,
      timezone: tenantViewModel.timezone,
      locale: tenantViewModel.locale,
      maxUsers: tenantViewModel.maxUsers,
      maxStorage: tenantViewModel.maxStorage,
      maxApiCalls: tenantViewModel.maxApiCalls,
      tenantMembers: tenantViewModel.tenantMembers,
      createdAt: tenantViewModel.createdAt,
      updatedAt: tenantViewModel.updatedAt,
    };
  }
}
