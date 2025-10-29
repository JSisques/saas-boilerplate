import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { ITenantCreateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-create/tenant-create-view-model.dto';
import { TenantPrimitives } from '@/tenant-context/tenants/domain/primitives/tenant.primitives';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant.view-model';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new tenant entity.
 */
@Injectable()
export class TenantViewModelFactory
  implements
    IReadFactory<
      TenantViewModel,
      ITenantCreateViewModelDto,
      TenantAggregate,
      TenantPrimitives
    >
{
  private readonly logger = new Logger(TenantViewModelFactory.name);

  /**
   * Creates a new tenant view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: ITenantCreateViewModelDto): TenantViewModel {
    this.logger.log(`Creating tenant view model from DTO: ${data}`);
    return new TenantViewModel(data);
  }

  /**
   * Creates a new tenant view model from a tenant primitive.
   *
   * @param tenantPrimitives - The tenant primitive to create the view model from.
   * @returns The tenant view model.
   */
  fromPrimitives(tenantPrimitives: TenantPrimitives): TenantViewModel {
    this.logger.log(
      `Creating tenant view model from primitives: ${tenantPrimitives}`,
    );

    const now = new Date();

    return new TenantViewModel({
      id: tenantPrimitives.id,
      name: tenantPrimitives.name,
      slug: tenantPrimitives.slug,
      description: tenantPrimitives.description,
      websiteUrl: tenantPrimitives.websiteUrl,
      logoUrl: tenantPrimitives.logoUrl,
      faviconUrl: tenantPrimitives.faviconUrl,
      primaryColor: tenantPrimitives.primaryColor,
      secondaryColor: tenantPrimitives.secondaryColor,
      status: tenantPrimitives.status,
      email: tenantPrimitives.email,
      phoneNumber: tenantPrimitives.phoneNumber,
      phoneCode: tenantPrimitives.phoneCode,
      address: tenantPrimitives.address,
      city: tenantPrimitives.city,
      state: tenantPrimitives.state,
      country: tenantPrimitives.country,
      postalCode: tenantPrimitives.postalCode,
      timezone: tenantPrimitives.timezone,
      locale: tenantPrimitives.locale,
      maxUsers: tenantPrimitives.maxUsers,
      maxStorage: tenantPrimitives.maxStorage,
      maxApiCalls: tenantPrimitives.maxApiCalls,
      createdAt: now,
      updatedAt: now,
    });
  }
  /**
   * Creates a new tenant view model from a tenant aggregate.
   *
   * @param tenantAggregate - The tenant aggregate to create the view model from.
   * @returns The tenant view model.
   */
  fromAggregate(tenantAggregate: TenantAggregate): TenantViewModel {
    this.logger.log(
      `Creating tenant view model from aggregate: ${tenantAggregate}`,
    );

    const now = new Date();

    return new TenantViewModel({
      id: tenantAggregate.id.value,
      name: tenantAggregate.name.value,
      slug: tenantAggregate.slug.value,
      description: tenantAggregate.description?.value || null,
      websiteUrl: tenantAggregate.websiteUrl?.value || null,
      logoUrl: tenantAggregate.logoUrl?.value || null,
      faviconUrl: tenantAggregate.faviconUrl?.value || null,
      primaryColor: tenantAggregate.primaryColor?.value || null,
      secondaryColor: tenantAggregate.secondaryColor?.value || null,
      status: tenantAggregate.status.value,
      email: tenantAggregate.email?.value || null,
      phoneNumber: tenantAggregate.phoneNumber?.value || null,
      phoneCode: tenantAggregate.phoneCode?.value || null,
      address: tenantAggregate.address?.value || null,
      city: tenantAggregate.city?.value || null,
      state: tenantAggregate.state?.value || null,
      country: tenantAggregate.country?.value || null,
      postalCode: tenantAggregate.postalCode?.value || null,
      timezone: tenantAggregate.timezone?.value || null,
      locale: tenantAggregate.locale?.value || null,
      maxUsers: tenantAggregate.maxUsers?.value || null,
      maxStorage: tenantAggregate.maxStorage?.value || null,
      maxApiCalls: tenantAggregate.maxApiCalls?.value || null,
      createdAt: now,
      updatedAt: now,
    });
  }
}
