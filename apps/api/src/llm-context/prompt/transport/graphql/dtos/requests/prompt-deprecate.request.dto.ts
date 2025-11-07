import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('PromptDeprecateRequestDto')
export class PromptDeprecateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the prompt',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
