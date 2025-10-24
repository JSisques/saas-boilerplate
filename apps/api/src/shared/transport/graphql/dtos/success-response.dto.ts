import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('MutationResponseDto')
export class MutationResponseDto {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  id?: string;
}
