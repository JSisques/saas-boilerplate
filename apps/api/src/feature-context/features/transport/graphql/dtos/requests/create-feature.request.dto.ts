import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('CreateFeatureRequestDto')
export class CreateFeatureRequestDto {
  @Field(() => String, { description: 'The unique key of the feature' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @Field(() => String, { description: 'The name of the feature' })
  @IsString()
  @IsNotEmpty()
  name: string;

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
