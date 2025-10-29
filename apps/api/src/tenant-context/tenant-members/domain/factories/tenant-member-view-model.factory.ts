import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { ITenantMemberCreateViewModelDto } from '@/tenant-context/tenant-members/domain/dtos/view-models/tenant-member-create/tenant-member-create-view-model.dto';
import { TenantMemberPrimitives } from '@/tenant-context/tenant-members/domain/primitives/tenant-member.primitives';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member.view-model';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new tenant entity.
 */
@Injectable()
export class TenantMemberViewModelFactory
  implements
    IReadFactory<
      TenantMemberViewModel,
      ITenantMemberCreateViewModelDto,
      TenantMemberAggregate,
      TenantMemberPrimitives
    >
{
  private readonly logger = new Logger(TenantMemberViewModelFactory.name);

  /**
   * Creates a new tenant view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: ITenantMemberCreateViewModelDto): TenantMemberViewModel {
    this.logger.log(`Creating tenant member view model from DTO: ${data}`);
    return new TenantMemberViewModel(data);
  }

  /**
   * Creates a new tenant member view model from a tenant member primitive.
   *
   * @param tenantMemberPrimitives - The tenant member primitive to create the view model from.
   * @returns The tenant member view model.
   */
  fromPrimitives(
    tenantMemberPrimitives: TenantMemberPrimitives,
  ): TenantMemberViewModel {
    this.logger.log(
      `Creating tenant member view model from primitives: ${tenantMemberPrimitives}`,
    );

    const now = new Date();

    return new TenantMemberViewModel({
      id: tenantMemberPrimitives.id,
      tenantId: tenantMemberPrimitives.tenantId,
      userId: tenantMemberPrimitives.userId,
      role: tenantMemberPrimitives.role,
      createdAt: now,
      updatedAt: now,
    });
  }
  /**
   * Creates a new tenant member view model from a tenant member aggregate.
   *
   * @param tenantMemberAggregate - The tenant member aggregate to create the view model from.
   * @returns The tenant member view model.
   */
  fromAggregate(
    tenantMemberAggregate: TenantMemberAggregate,
  ): TenantMemberViewModel {
    this.logger.log(
      `Creating tenant member view model from aggregate: ${tenantMemberAggregate}`,
    );

    const now = new Date();

    return new TenantMemberViewModel({
      id: tenantMemberAggregate.id.value,
      tenantId: tenantMemberAggregate.tenantId.value,
      userId: tenantMemberAggregate.userId.value,
      role: tenantMemberAggregate.role.value,
      createdAt: now,
      updatedAt: now,
    });
  }
}
