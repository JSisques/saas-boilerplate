import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';

import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('SagaStepUpdateRequestDto')
export class SagaStepUpdateRequestDto {
  @Field(() => String, {
    description: 'The id of the saga step',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the saga step',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Number, {
    description: 'The order of the saga step',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @Field(() => SagaStepStatusEnum, {
    description: 'The status of the saga step',
    nullable: true,
  })
  @IsEnum(SagaStepStatusEnum)
  @IsOptional()
  status?: SagaStepStatusEnum;

  @Field(() => Date, {
    description: 'The start date of the saga step',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  startDate?: Date | null;

  @Field(() => Date, {
    description: 'The end date of the saga step',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  endDate?: Date | null;

  @Field(() => String, {
    description: 'The error message of the saga step',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  errorMessage?: string | null;

  @Field(() => Number, {
    description: 'The retry count of the saga step',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  retryCount?: number;

  @Field(() => Number, {
    description: 'The max retries of the saga step',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  maxRetries?: number;

  @Field(() => String, {
    description: 'The payload of the saga step (JSON string)',
    nullable: true,
  })
  @IsJSON()
  @IsOptional()
  payload?: string;

  @Field(() => String, {
    description: 'The result of the saga step (JSON string)',
    nullable: true,
  })
  @IsJSON()
  @IsOptional()
  result?: string;
}
