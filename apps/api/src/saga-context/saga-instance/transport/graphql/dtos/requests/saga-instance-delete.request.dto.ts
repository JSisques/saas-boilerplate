import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaInstanceDeleteRequestDto')
export class SagaInstanceDeleteRequestDto {
  @Field(() => String, {
    description: 'The id of the saga instance',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
