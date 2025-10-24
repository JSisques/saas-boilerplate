import { CreateUserRequestDto } from '@/features/users/transport/graphql/dtos/requests/create-user.request.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('UpdateUserRequestDto')
export class UpdateUserRequestDto extends PartialType(CreateUserRequestDto) {
  @Field(() => String, { description: 'The id of the user' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
