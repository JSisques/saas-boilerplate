import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaLogFindBySagaInstanceIdRequestDto')
export class SagaLogFindBySagaInstanceIdRequestDto {
  @Field(() => String, {
    description: 'The saga instance id',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  sagaInstanceId: string;
}
