import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('LoginResponseDto')
export class LoginResponseDto {
  @Field(() => String, { description: 'The access token' })
  accessToken: string;

  @Field(() => String, { description: 'The refresh token' })
  refreshToken: string;
}
