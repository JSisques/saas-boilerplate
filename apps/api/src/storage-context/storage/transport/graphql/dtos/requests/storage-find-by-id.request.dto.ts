import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('StorageFindByIdRequestDto')
export class StorageFindByIdRequestDto {
  @Field(() => String, {
    description: 'The id of the storage',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
