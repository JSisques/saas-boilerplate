import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('FeatureChangeStatusRequestDto')
export class FeatureChangeStatusRequestDto {
  @Field(() => String, { description: 'The id of the feature' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { description: 'The new status of the feature' })
  @IsEnum(FeatureStatusEnum)
  @IsNotEmpty()
  status: FeatureStatusEnum;
}
