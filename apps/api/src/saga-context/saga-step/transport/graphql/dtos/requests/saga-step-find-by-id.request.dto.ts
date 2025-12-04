import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaStepFindByIdRequestDto')
export class SagaStepFindByIdRequestDto {
  @Field(() => String, {
    description: 'The id of the saga step',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
