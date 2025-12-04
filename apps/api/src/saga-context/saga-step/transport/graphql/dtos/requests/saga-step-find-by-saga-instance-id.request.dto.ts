import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaStepFindBySagaInstanceIdRequestDto')
export class SagaStepFindBySagaInstanceIdRequestDto {
  @Field(() => String, {
    description: 'The saga instance id',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  sagaInstanceId: string;
}
