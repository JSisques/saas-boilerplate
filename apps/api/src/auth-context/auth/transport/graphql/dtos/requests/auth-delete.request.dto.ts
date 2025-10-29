import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('AuthDeleteRequestDto')
export class AuthDeleteRequestDto {
  @Field(() => String, { description: 'The unique identifier of the auth' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
