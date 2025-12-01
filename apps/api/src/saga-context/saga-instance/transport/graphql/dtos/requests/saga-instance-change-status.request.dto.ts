import { SagaStatusEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaInstanceChangeStatusRequestDto')
export class SagaInstanceChangeStatusRequestDto {
  @Field(() => String, {
    description: 'The id of the saga instance',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => SagaStatusEnum, {
    description: 'The status of the saga instance',
    nullable: false,
  })
  @IsEnum(SagaStatusEnum)
  @IsNotEmpty()
  status: SagaStatusEnum;
}
