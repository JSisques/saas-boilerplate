import { MutationResponseDto } from '@/shared/transport/graphql/dtos/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response.mapper';
import { StorageDeleteFileCommand } from '@/storage-context/storage/application/commands/storage-delete-file/storage-delete-file.command';
import { StorageDownloadFileCommand } from '@/storage-context/storage/application/commands/storage-download-file/storage-download-file.command';
import { StorageUploadFileCommand } from '@/storage-context/storage/application/commands/storage-upload-file/storage-upload-file.command';
import { StorageFindByIdQuery } from '@/storage-context/storage/application/queries/storage-find-by-id/storage-find-by-id.query';
import { StorageDeleteFileRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-delete-file.request.dto';
import { StorageDownloadFileRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-download-file.request.dto';
import { StorageDownloadFileResponseDto } from '@/storage-context/storage/transport/graphql/dtos/responses/storage-download-file.response.dto';
import { Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';

@Resolver()
export class StorageMutationsResolver {
  private readonly logger = new Logger(StorageMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
  async storageUploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Uploading file: ${file.filename}`);

    // 01: Read file buffer
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // 02: Get file size
    const fileSize = buffer.length;

    // 03: Send the command to the command bus
    const storageId = await this.commandBus.execute(
      new StorageUploadFileCommand({
        buffer,
        fileName: filename,
        mimetype,
        size: fileSize,
      }),
    );

    // 04: Return the storage id
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'File uploaded successfully',
      id: storageId,
    });
  }

  @Mutation(() => [StorageDownloadFileResponseDto])
  async storageDownloadFiles(
    @Args('input') input: StorageDownloadFileRequestDto,
  ): Promise<StorageDownloadFileResponseDto[]> {
    this.logger.log(`Downloading ${input.ids.length} files`);

    const results = await Promise.all(
      input.ids.map(async (id) => {
        // 01: Get storage information first
        const storage = await this.queryBus.execute(
          new StorageFindByIdQuery({ id }),
        );

        // 02: Download file buffer
        const fileBuffer = await this.commandBus.execute(
          new StorageDownloadFileCommand({ id }),
        );

        // 03: Convert buffer to base64 and return with metadata
        return {
          content: fileBuffer.toString('base64'),
          fileName: storage.fileName.value,
          mimeType: storage.mimeType.value,
          fileSize: storage.fileSize.value,
        };
      }),
    );

    return results;
  }

  @Mutation(() => MutationResponseDto)
  async storageDeleteFile(
    @Args('input') input: StorageDeleteFileRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting file: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new StorageDeleteFileCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'File deleted successfully',
      id: input.id,
    });
  }
}
