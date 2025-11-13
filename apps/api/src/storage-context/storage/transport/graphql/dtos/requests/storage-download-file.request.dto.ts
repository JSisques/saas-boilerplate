import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('StorageDownloadFileRequestDto')
export class StorageDownloadFileRequestDto {
  @Field(() => [String], {
    description: 'The unique identifiers of the storages',
    nullable: false,
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  ids: string[];
}
