import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('StorageDeleteFileRequestDto')
export class StorageDeleteFileRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the storage',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
