import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('MutationResponseArrayDto')
export class MutationResponseArrayDto {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [String], { nullable: true })
  ids?: string[];
}
