import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType('EventReplayRequestDto')
export class EventReplayRequestDto {
  @Field(() => String, {
    description: 'The id of the event to replay',
    nullable: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @Field(() => String, { description: 'The type of the event to replay' })
  @IsNotEmpty()
  eventType: string;

  @Field(() => String, { description: 'The aggregate id', nullable: true })
  @IsUUID()
  @IsNotEmpty()
  aggregateId?: string;

  @Field(() => String, { description: 'The aggregate type', nullable: true })
  @IsNotEmpty()
  aggregateType?: string;

  @Field(() => Date, { description: 'The start date of the event to replay' })
  @IsNotEmpty()
  @IsDate()
  from: Date;

  @Field(() => Date, { description: 'The end date of the event to replay' })
  @IsNotEmpty()
  @IsDate()
  to: Date;

  @Field(() => Int, { description: 'Batch size for replay', nullable: true })
  @IsOptional()
  @IsInt()
  batchSize?: number;
}
