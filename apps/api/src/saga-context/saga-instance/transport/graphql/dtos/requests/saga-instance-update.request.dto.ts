import { SagaStatusEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('SagaInstanceUpdateRequestDto')
export class SagaInstanceUpdateRequestDto {
  @Field(() => String, {
    description: 'The id of the saga instance',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the saga instance',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => SagaStatusEnum, {
    description: 'The status of the saga instance',
    nullable: true,
  })
  @IsEnum(SagaStatusEnum)
  @IsOptional()
  status?: SagaStatusEnum;

  @Field(() => Date, {
    description: 'The start date of the saga instance',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  startDate?: Date | null;

  @Field(() => Date, {
    description: 'The end date of the saga instance',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  endDate?: Date | null;
}
