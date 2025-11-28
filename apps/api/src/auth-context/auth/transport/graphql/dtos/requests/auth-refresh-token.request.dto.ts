import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('AuthRefreshTokenRequestDto')
export class AuthRefreshTokenRequestDto {
  @Field(() => String, {
    description: 'The refresh token to use for generating a new access token',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
