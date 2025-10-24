import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('DeleteUserRequestDto')
export class DeleteUserRequestDto {
  @Field(() => String, { description: 'The id of the user' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
