import { TenantMemberRoleEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('TenantMemberUpdateRequestDto')
export class TenantMemberUpdateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the tenant member',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => TenantMemberRoleEnum, {
    description: 'The role of the tenant member',
    nullable: true,
  })
  @IsEnum(TenantMemberRoleEnum)
  @IsNotEmpty()
  role: TenantMemberRoleEnum;
}
