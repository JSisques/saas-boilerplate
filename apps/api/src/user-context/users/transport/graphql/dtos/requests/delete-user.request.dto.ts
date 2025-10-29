import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('DeleteUserRequestDto')
export class DeleteUserRequestDto {
  @Field(() => String, { description: 'The unique identifier of the user' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
