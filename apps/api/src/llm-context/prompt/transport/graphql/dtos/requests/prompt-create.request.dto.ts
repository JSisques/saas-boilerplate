import { PromptStatusEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('PromptCreateRequestDto')
export class PromptCreateRequestDto {
  @Field(() => String, {
    description: 'The title of the prompt',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => String, {
    description: 'The description of the prompt',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  description: string | null;

  @Field(() => String, {
    description: 'The content of the prompt',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  content: string;

  @Field(() => PromptStatusEnum, {
    description: 'The status of the prompt',
    nullable: false,
  })
  @IsEnum(PromptStatusEnum)
  @IsNotEmpty()
  status: PromptStatusEnum;
}
