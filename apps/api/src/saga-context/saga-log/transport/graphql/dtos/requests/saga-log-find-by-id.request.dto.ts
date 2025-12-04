import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaLogFindByIdRequestDto')
export class SagaLogFindByIdRequestDto {
  @Field(() => String, {
    description: 'The id of the saga log',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
