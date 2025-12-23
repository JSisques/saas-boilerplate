import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaStepChangeStatusRequestDto')
export class SagaStepChangeStatusRequestDto {
  @Field(() => String, {
    description: 'The id of the saga step',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => SagaStepStatusEnum, {
    description: 'The status of the saga step',
    nullable: false,
  })
  @IsEnum(SagaStepStatusEnum)
  @IsNotEmpty()
  status: SagaStepStatusEnum;
}
