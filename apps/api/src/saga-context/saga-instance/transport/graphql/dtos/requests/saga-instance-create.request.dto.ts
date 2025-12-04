import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('SagaInstanceCreateRequestDto')
export class SagaInstanceCreateRequestDto {
  @Field(() => String, {
    description: 'The name of the saga instance',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
