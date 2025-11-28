import { PromptStatusEnum } from '@/prisma/master/client';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PromptResponseDto')
export class PromptResponseDto {
  @Field(() => String, {
    nullable: false,
    description: 'The id of the prompt',
  })
  id: string;

  @Field(() => String, {
    nullable: false,
    description: 'The name of the prompt',
  })
  slug: string;

  @Field(() => String, {
    nullable: false,
    description: 'The version of the prompt',
  })
  version: number;

  @Field(() => String, {
    nullable: false,
    description: 'The title of the prompt',
  })
  title: string;

  @Field(() => String, {
    nullable: false,
    description: 'The description of the prompt',
  })
  description: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'The content of the prompt',
  })
  content: string;

  @Field(() => PromptStatusEnum, {
    nullable: false,
    description: 'The status of the prompt',
  })
  status: PromptStatusEnum;

  @Field(() => String, {
    nullable: true,
    description: 'The is active of the prompt',
  })
  isActive: boolean;

  @Field(() => Date, {
    nullable: false,
    description: 'The created at of the prompt',
  })
  createdAt: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'The updated at of the prompt',
  })
  updatedAt: Date;
}

@ObjectType('PaginatedPromptResultDto')
export class PaginatedPromptResultDto extends BasePaginatedResultDto {
  @Field(() => [PromptResponseDto], {
    description: 'The prompts in the current page',
  })
  items: PromptResponseDto[];
}
