import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model/tenant-view-model.factory';
import { TenantMemberViewModel } from '@/tenant-context/tenants/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantMemberMongoDbDto } from '@/tenant-context/tenants/infrastructure/database/mongodb/dtos/tenant-member/tenant-member-mongodb.dto';
import { TenantMongoDbDto } from '@/tenant-context/tenants/infrastructure/database/mongodb/dtos/tenant/tenant-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantMongoDBMapper {
  private readonly logger = new Logger(TenantMongoDBMapper.name);

  constructor(
    private readonly tenantViewModelFactory: TenantViewModelFactory,
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

    return this.tenantViewModelFactory.create({
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      websiteUrl: doc.websiteUrl,
      logoUrl: doc.logoUrl,
      faviconUrl: doc.faviconUrl,
      primaryColor: doc.primaryColor,
      secondaryColor: doc.secondaryColor,
      status: doc.status,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      phoneCode: doc.phoneCode,
      address: doc.address,
      city: doc.city,
      state: doc.state,
      country: doc.country,
      postalCode: doc.postalCode,
      timezone: doc.timezone,
      locale: doc.locale,
      maxUsers: doc.maxUsers,
      maxStorage: doc.maxStorage,
      maxApiCalls: doc.maxApiCalls,
      tenantMembers: this.mapTenantMembers(doc.tenantMembers),
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Maps tenant members from MongoDB format to ViewModel format
   */
  private mapTenantMembers(
    members: TenantMemberMongoDbDto[] | undefined,
  ): TenantMemberViewModel[] {
    if (!members || !Array.isArray(members)) {
      return [];
    }

    return members.map(
      (member) =>
        new TenantMemberViewModel({
          id: member.id,
          userId: member.userId,
          role: member.role,
          createdAt: new Date(member.createdAt),
          updatedAt: new Date(member.updatedAt),
        }),
    );
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
      tenantMembers: this.mapTenantMembersToMongo(
        tenantViewModel.tenantMembers,
      ),
      createdAt: tenantViewModel.createdAt,
      updatedAt: tenantViewModel.updatedAt,
    };
  }

  /**
   * Maps tenant members from ViewModel to MongoDB format (plain objects)
   */
  private mapTenantMembersToMongo(
    members: TenantMemberViewModel[] | undefined,
  ): TenantMemberMongoDbDto[] {
    if (!members || !Array.isArray(members)) {
      return [];
    }

    return members.map((member) => ({
      id: member.id,
      userId: member.userId,
      role: member.role,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }));
  }
}
