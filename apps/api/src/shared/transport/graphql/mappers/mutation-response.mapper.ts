import { MutationResponseDto } from '@/shared/transport/graphql/dtos/success-response.dto';
import { Injectable } from '@nestjs/common';

export const MUTATION_RESPONSE_GRAPHQL_MAPPER_TOKEN = Symbol(
  'MutationResponseGraphQLMapper',
);
@Injectable()
export class MutationResponseGraphQLMapper {
  /**
   * Maps a mutation response to a mutation response DTO
   *
   * @param success - Whether the mutation was successful
   * @param message - The message to return
   * @param id - The id of the entity that was created, deleted or updated
   * @returns The mutation response DTO
   */
  toResponseDto(
    success: boolean,
    message?: string,
    id?: string,
  ): MutationResponseDto {
    return {
      success,
      message,
      id,
    };
  }
}
