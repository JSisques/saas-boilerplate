'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  CreateUserInput,
  DeleteUserInput,
  PaginatedUserResult,
  UpdateUserInput,
  UserFindByCriteriaInput,
  UserFindByIdInput,
  UserResponse,
} from '../index.js';

/**
 * Hook for user operations
 */
export function useUsers() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedUserResult,
    [UserFindByCriteriaInput?]
  >((input?: UserFindByCriteriaInput) => sdk.users.findByCriteria(input));

  const findById = useAsyncState<UserResponse, [UserFindByIdInput]>(
    (input: UserFindByIdInput) => sdk.users.findById(input),
  );

  const create = useAsyncState<MutationResponse, [CreateUserInput]>(
    (input: CreateUserInput) => sdk.users.create(input),
  );

  const update = useAsyncState<MutationResponse, [UpdateUserInput]>(
    (input: UpdateUserInput) => sdk.users.update(input),
  );

  const remove = useAsyncState<MutationResponse, [DeleteUserInput]>(
    (input: DeleteUserInput) => sdk.users.delete(input),
  );

  return {
    findByCriteria: {
      ...findByCriteria,
      fetch: findByCriteria.execute,
    },
    findById: {
      ...findById,
      fetch: findById.execute,
    },
    create: {
      ...create,
      mutate: create.execute,
    },
    update: {
      ...update,
      mutate: update.execute,
    },
    delete: {
      ...remove,
      mutate: remove.execute,
    },
  };
}
