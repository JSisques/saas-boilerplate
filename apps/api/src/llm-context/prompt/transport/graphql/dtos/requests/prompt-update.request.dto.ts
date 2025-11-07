import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('PromptUpdateRequestDto')
export class PromptUpdateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the prompt',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The version of the prompt',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  version: number | null;

  @Field(() => String, {
    description: 'The title of the prompt',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  title: string;

  @Field(() => String, {
    description: 'The description of the prompt',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @Field(() => String, {
    description: 'The content of the prompt',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  content: string;
}
