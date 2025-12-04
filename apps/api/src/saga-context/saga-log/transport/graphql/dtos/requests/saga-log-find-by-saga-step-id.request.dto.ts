import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaLogFindBySagaStepIdRequestDto')
export class SagaLogFindBySagaStepIdRequestDto {
  @Field(() => String, {
    description: 'The saga step id',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  sagaStepId: string;
}
