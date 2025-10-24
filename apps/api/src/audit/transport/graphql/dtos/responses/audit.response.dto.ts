import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AuditResponseDto')
export class AuditResponseDto {
  @Field(() => String, { description: 'The id of the user' })
  id: string;

  @Field(() => String, { nullable: true, description: 'The name of the audit' })
  eventType?: string;

  @Field(() => String, { nullable: true, description: 'The bio of the user' })
  aggregateType?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The aggregate id of the audit',
  })
  aggregateId?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The payload of the audit',
  })
  payload?: string;

  @Field(() => Date, {
    nullable: true,
    description: 'The timestamp of the audit',
  })
  timestamp?: Date;
}

@ObjectType('PaginatedAuditResultDto')
export class PaginatedAuditResultDto extends BasePaginatedResultDto {
  @Field(() => [AuditResponseDto], {
    description: 'The audits in the current page',
  })
  items: AuditResponseDto[];
}
