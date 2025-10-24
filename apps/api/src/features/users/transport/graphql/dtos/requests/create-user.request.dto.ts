import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';

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
  @IsString()
  @IsOptional()
  @IsUrl()
  avatar: string;
}
