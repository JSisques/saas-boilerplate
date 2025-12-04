import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SagaInstanceFindByIdRequestDto')
export class SagaInstanceFindByIdRequestDto {
  @Field(() => String, {
    description: 'The id of the saga instance',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
