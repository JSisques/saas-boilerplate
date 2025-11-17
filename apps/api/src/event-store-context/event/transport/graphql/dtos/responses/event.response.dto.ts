import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('EventResponseDto')
export class EventResponseDto {
  @Field(() => String, { description: 'The id of the event' })
  id: string;

  @Field(() => String, { nullable: true, description: 'The name of the event' })
  eventType?: string;

  @Field(() => String, { nullable: true, description: 'The bio of the event' })
  aggregateType?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The aggregate id of the event',
  })
  aggregateId?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The payload of the event',
  })
  payload?: string;

  @Field(() => Date, {
    nullable: true,
    description: 'The timestamp of the event',
  })
  timestamp?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The created at of the event',
  })
  createdAt?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The updated at of the event',
  })
  updatedAt?: Date;
}

@ObjectType('PaginatedEventResultDto')
export class PaginatedEventResultDto extends BasePaginatedResultDto {
  @Field(() => [EventResponseDto], {
    description: 'The events in the current page',
  })
  items: EventResponseDto[];
}
