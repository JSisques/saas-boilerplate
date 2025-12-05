import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('AuthRegisterByEmailRequestDto')
export class AuthRegisterByEmailRequestDto {
  @Field(() => String, {
    description: 'The email of the auth',
    nullable: false,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, {
    description: 'The password of the auth',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field(() => String, {
    description: 'Optional tenant name to create during registration',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  tenantName?: string;
}
