import { MutationResponseArrayDto } from '@/shared/transport/graphql/dtos/success-response-array.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/success-response.dto';
import { Injectable } from '@nestjs/common';

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
  toResponseDto(props: MutationResponseDto): MutationResponseDto {
    return {
      success: props.success,
      message: props.message,
      id: props.id,
    };
  }

  /**
   * Maps an array of mutation responses to an array of mutation response DTOs
   *
   * @param props - The array of mutation response DTOs
   * @returns The array of mutation response DTOs
   */
  toResponseDtoArray(
    props: MutationResponseArrayDto,
  ): MutationResponseArrayDto {
    return {
      success: props.success,
      message: props.message,
      ids: props.ids,
    };
  }
}
