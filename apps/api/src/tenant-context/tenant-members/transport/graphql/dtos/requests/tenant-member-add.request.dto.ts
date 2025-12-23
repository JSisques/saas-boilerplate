import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('TenantMemberAddRequestDto')
export class TenantMemberAddRequestDto {
  @Field(() => String, {
    description: 'The id of the tenant',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @Field(() => String, {
    description: 'The id of the user',
    nullable: true,
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field(() => TenantMemberRoleEnum, {
    description: 'The role of the tenant member',
    nullable: false,
  })
  @IsEnum(TenantMemberRoleEnum)
  @IsNotEmpty()
  role: TenantMemberRoleEnum;
}
