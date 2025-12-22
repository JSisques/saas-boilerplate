import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

@InputType('AuthUpdateRequestDto')
export class AuthUpdateRequestDto {
  @Field(() => String, { description: 'The unique identifier of the auth' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { description: 'The email of the auth', nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, {
    description: 'The bio of the user',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field(() => String, {
    description: 'The avatar url of the user',
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @Field(() => String, {
    description: 'The last name of the user',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field(() => String, {
    description: 'The user name of the user',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  userName?: string;

  @Field(() => UserRoleEnum, {
    description: 'The role of the user',
    nullable: true,
  })
  @IsEnum(UserRoleEnum)
  @IsOptional()
  role?: UserRoleEnum;

  @Field(() => UserStatusEnum, {
    description: 'The status of the user',
    nullable: true,
  })
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum;
}
