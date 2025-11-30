import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('RefreshTokenResponseDto')
export class RefreshTokenResponseDto {
  @Field(() => String, { description: 'The new access token' })
  accessToken: string;
}
