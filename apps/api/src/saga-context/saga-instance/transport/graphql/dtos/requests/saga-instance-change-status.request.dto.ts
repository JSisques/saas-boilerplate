import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
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

  @Field(() => SagaInstanceStatusEnum, {
    description: 'The status of the saga instance',
    nullable: false,
  })
  @IsEnum(SagaInstanceStatusEnum)
  @IsNotEmpty()
  status: SagaInstanceStatusEnum;
}
