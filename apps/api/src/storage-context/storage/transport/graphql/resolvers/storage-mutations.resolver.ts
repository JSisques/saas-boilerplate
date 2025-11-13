import { MutationResponseDto } from '@/shared/transport/graphql/dtos/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response.mapper';
import { StorageDeleteFileCommand } from '@/storage-context/storage/application/commands/storage-delete-file/storage-delete-file.command';
import { StorageDownloadFileCommand } from '@/storage-context/storage/application/commands/storage-download-file/storage-download-file.command';
import { StorageUploadFileCommand } from '@/storage-context/storage/application/commands/storage-upload-file/storage-upload-file.command';
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

    const promises = input.ids.map(async (id) => {
      const fileBuffer = await this.commandBus.execute(
        new StorageDownloadFileCommand({ id }),
      );
      return fileBuffer;
    });

    const fileBuffers = await Promise.all(promises);

    return fileBuffers.map((fileBuffer) => ({
      content: fileBuffer.toString('base64'),
      fileName: fileBuffer.fileName,
      mimeType: fileBuffer.mimeType,
      fileSize: fileBuffer.fileSize,
    }));
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
