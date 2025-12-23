import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('DeleteFeatureRequestDto')
export class DeleteFeatureRequestDto {
  @Field(() => String, { description: 'The id of the feature' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
