import { Field, InputType } from '@nestjs/graphql';
import { PromptStatusEnum } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType('PromptCreateRequestDto')
export class PromptCreateRequestDto {
  @Field(() => Number, {
    description: 'The version of the prompt',
    nullable: false,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  version: number;

  @Field(() => String, {
    description: 'The title of the prompt',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => Date, {
    description: 'The description of the prompt',
    nullable: false,
  })
  @IsDate()
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

  @Field(() => Boolean, {
    description: 'The is active of the prompt',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
