import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('UpdateFeatureRequestDto')
export class UpdateFeatureRequestDto {
  @Field(() => String, { description: 'The id of the feature' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The unique key of the feature',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @Field(() => String, {
    description: 'The name of the feature',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, {
    description: 'The description of the feature',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string | null;

  @Field(() => String, {
    description: 'The status of the feature',
    nullable: true,
  })
  @IsEnum(FeatureStatusEnum)
  @IsOptional()
  status?: FeatureStatusEnum;
}
