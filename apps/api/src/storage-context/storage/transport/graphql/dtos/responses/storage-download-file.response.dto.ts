import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('StorageDownloadFileResponseDto')
export class StorageDownloadFileResponseDto {
  @Field(() => String, { description: 'The file content as base64' })
  content: string;

  @Field(() => String, { description: 'The file name' })
  fileName: string;

  @Field(() => String, { description: 'The MIME type' })
  mimeType: string;

  @Field(() => Number, { description: 'The file size in bytes' })
  fileSize: number;
}
