import { StatusEnum, UserRoleEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

@InputType('CreateUserRequestDto')
export class CreateUserRequestDto {
  @Field(() => String, { description: 'The name of the user', nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field(() => String, {
    description: 'The bio of the user',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  bio: string;

  @Field(() => String, {
    description: 'The avatar url of the user',
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  avatarUrl: string;

  @Field(() => String, {
    description: 'The last name of the user',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => String, {
    description: 'The user name of the user',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  userName?: string;

  @Field(() => UserRoleEnum, {
    description: 'The role of the user',
    nullable: false,
  })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @Field(() => StatusEnum, {
    description: 'The status of the user',
    nullable: false,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
