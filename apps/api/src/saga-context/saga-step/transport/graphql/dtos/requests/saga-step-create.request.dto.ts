import { Field, InputType } from '@nestjs/graphql';
import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('SagaStepCreateRequestDto')
export class SagaStepCreateRequestDto {
  @Field(() => String, {
    description: 'The saga instance ID',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  sagaInstanceId: string;

  @Field(() => String, {
    description: 'The name of the saga step',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Number, {
    description: 'The order of the saga step',
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @Field(() => String, {
    description: 'The payload of the saga step (JSON string)',
    nullable: false,
  })
  @IsJSON()
  @IsNotEmpty()
  payload: string;
}
