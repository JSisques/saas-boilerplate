import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('FeatureResponseDto')
export class FeatureResponseDto {
  @Field(() => String, { description: 'The id of the feature' })
  id: string;

  @Field(() => String, { description: 'The unique key of the feature' })
  key: string;

  @Field(() => String, { description: 'The name of the feature' })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'The description of the feature',
  })
  description?: string | null;

  @Field(() => String, { description: 'The status of the feature' })
  status: string;

  @Field(() => Date, {
    description: 'The created at timestamp of the feature',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'The updated at timestamp of the feature',
  })
  updatedAt: Date;
}

@ObjectType('PaginatedFeatureResultDto')
export class PaginatedFeatureResultDto extends BasePaginatedResultDto {
  @Field(() => [FeatureResponseDto], {
    description: 'The features in the current page',
  })
  items: FeatureResponseDto[];
}
