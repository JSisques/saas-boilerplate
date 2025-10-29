import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { ITenantMemberCreateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-create/tenant-member-create.dto';
import { TenantMemberPrimitives } from '@/tenant-context/tenant-members/domain/primitives/tenant-member.primitives';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating TenantAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate tenant information.
 */
@Injectable()
export class TenantMemberAggregateFactory
  implements IWriteFactory<TenantMemberAggregate, ITenantMemberCreateDto>
{
  /**
   * Creates a new TenantMemberAggregate entity using the provided properties.
   *
   * @param data - The tenant member create data.
   * @param data.id - The tenant member id.
   * @param data.tenantId - The tenant id.
   * @param data.userId - The user id.
   * @param data.role - The tenant member role.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {TenantMemberAggregate} - The created tenant member aggregate entity.
   */
  public create(
    data: ITenantMemberCreateDto,
    generateEvent: boolean = true,
  ): TenantMemberAggregate {
    return new TenantMemberAggregate(data, generateEvent);
  }

  /**
   * Creates a new TenantMemberAggregate entity from primitive data.
   *
   * @param data - The tenant primitive data.
   * @param data.id - The tenant member id.
   * @param data.tenantId - The tenant id.
   * @param data.userId - The user id.
   * @param data.role - The tenant member role.
   * @returns The created tenant member aggregate entity.
   */
  public fromPrimitives(data: TenantMemberPrimitives): TenantMemberAggregate {
    return new TenantMemberAggregate({
      id: new TenantMemberUuidValueObject(data.id),
      tenantId: new TenantUuidValueObject(data.tenantId),
      userId: new UserUuidValueObject(data.userId),
      role: new TenantMemberRoleValueObject(data.role),
    });
  }
}
