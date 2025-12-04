import { SagaLogTypeEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType('SagaLogCreateRequestDto')
export class SagaLogCreateRequestDto {
  @Field(() => String, {
    description: 'The saga instance ID',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  sagaInstanceId: string;

  @Field(() => String, {
    description: 'The saga step ID',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  sagaStepId: string;

  @Field(() => SagaLogTypeEnum, {
    description: 'The type of the saga log',
    nullable: false,
  })
  @IsEnum(SagaLogTypeEnum)
  @IsNotEmpty()
  type: SagaLogTypeEnum;

  @Field(() => String, {
    description: 'The message of the saga log',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
