import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType('PromptChangeStatusRequestDto')
export class PromptChangeStatusRequestDto {
  @Field(() => String, {
    description: 'The id of the prompt to change status',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => PromptStatusEnum, {
    description: 'The new status to set',
    nullable: false,
  })
  @IsEnum(PromptStatusEnum)
  @IsNotEmpty()
  status: PromptStatusEnum;
}
