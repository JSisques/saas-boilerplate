import { MutationResponseDto } from './success-response.dto';

describe('MutationResponseDto', () => {
  it('should be defined', () => {
    expect(MutationResponseDto).toBeDefined();
  });

  it('should create a mutation response with success', () => {
    const response = new MutationResponseDto();
    response.success = true;

    expect(response.success).toBe(true);
  });

  it('should create a mutation response with success and message', () => {
    const response = new MutationResponseDto();
    response.success = true;
    response.message = 'Operation completed successfully';

    expect(response.success).toBe(true);
    expect(response.message).toBe('Operation completed successfully');
  });

  it('should create a mutation response with success, message and id', () => {
    const response = new MutationResponseDto();
    response.success = true;
    response.message = 'Entity created';
    response.id = '123e4567-e89b-12d3-a456-426614174000';

    expect(response.success).toBe(true);
    expect(response.message).toBe('Entity created');
    expect(response.id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should create a failed mutation response', () => {
    const response = new MutationResponseDto();
    response.success = false;
    response.message = 'Operation failed';

    expect(response.success).toBe(false);
    expect(response.message).toBe('Operation failed');
  });

  it('should allow optional message', () => {
    const response = new MutationResponseDto();
    response.success = true;

    expect(response.success).toBe(true);
    expect(response.message).toBeUndefined();
  });

  it('should allow optional id', () => {
    const response = new MutationResponseDto();
    response.success = true;
    response.message = 'Operation completed';

    expect(response.success).toBe(true);
    expect(response.id).toBeUndefined();
  });
});
