import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('UserFindByIdRequestDto')
export class UserFindByIdRequestDto {
  @Field(() => String, { description: 'The id of the user' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
