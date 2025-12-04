import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaLogDeleteRequestDto')
export class SagaLogDeleteRequestDto {
  @Field(() => String, {
    description: 'The id of the saga log',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
