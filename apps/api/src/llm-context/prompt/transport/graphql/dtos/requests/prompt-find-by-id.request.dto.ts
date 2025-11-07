import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('PromptFindByIdRequestDto')
export class PromptFindByIdRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the prompt',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
