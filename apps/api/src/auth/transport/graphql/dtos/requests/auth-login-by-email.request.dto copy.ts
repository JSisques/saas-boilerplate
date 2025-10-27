import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType('AuthLoginByEmailRequestDto')
export class AuthLoginByEmailRequestDto {
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
}
