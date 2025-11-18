import { Test, TestingModule } from '@nestjs/testing';
import { MutationResponseGraphQLMapper } from './mutation-response.mapper';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';

describe('MutationResponseGraphQLMapper', () => {
  let mapper: MutationResponseGraphQLMapper;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [MutationResponseGraphQLMapper],
    }).compile();

    mapper = module.get<MutationResponseGraphQLMapper>(
      MutationResponseGraphQLMapper,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  describe('toResponseDto', () => {
    it('should map mutation response with success only', () => {
      const props: MutationResponseDto = {
        success: true,
      };

      const result = mapper.toResponseDto(props);

      expect(result).toEqual({
        success: true,
        message: undefined,
        id: undefined,
      });
    });

    it('should map mutation response with success and message', () => {
      const props: MutationResponseDto = {
        success: true,
        message: 'Operation completed successfully',
      };

      const result = mapper.toResponseDto(props);

      expect(result).toEqual({
        success: true,
        message: 'Operation completed successfully',
        id: undefined,
      });
    });

    it('should map mutation response with success, message and id', () => {
      const props: MutationResponseDto = {
        success: true,
        message: 'Entity created',
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = mapper.toResponseDto(props);

      expect(result).toEqual({
        success: true,
        message: 'Entity created',
        id: '123e4567-e89b-12d3-a456-426614174000',
      });
    });

    it('should map failed mutation response', () => {
      const props: MutationResponseDto = {
        success: false,
        message: 'Operation failed',
      };

      const result = mapper.toResponseDto(props);

      expect(result).toEqual({
        success: false,
        message: 'Operation failed',
        id: undefined,
      });
    });

    it('should map mutation response with id only', () => {
      const props: MutationResponseDto = {
        success: true,
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = mapper.toResponseDto(props);

      expect(result).toEqual({
        success: true,
        message: undefined,
        id: '123e4567-e89b-12d3-a456-426614174000',
      });
    });

    it('should return a new object', () => {
      const props: MutationResponseDto = {
        success: true,
        message: 'Test',
      };

      const result = mapper.toResponseDto(props);

      expect(result).not.toBe(props);
      expect(result).toEqual(props);
    });
  });
});

