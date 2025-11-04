import { useEffect } from 'react';
import type { SDK } from '../../index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  CreateUserInput,
  DeleteUserInput,
  PaginatedUserResult,
  UpdateUserInput,
  UserFindByCriteriaInput,
  UserFindByIdInput,
  UserResponse,
} from '../../user-context/types/index.js';
import { useAsyncState } from './use-async-state.js';

/**
 * Hook for user operations
 */
export function useUsers(sdk: SDK) {
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

/**
 * Hook to fetch users by criteria with automatic execution
 */
export function useUsersList(
  sdk: SDK,
  input?: UserFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useUsers(sdk);
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input);
    }
  }, [enabled, input, findByCriteria]);

  return findByCriteria;
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(
  sdk: SDK,
  userId: string | null,
  options?: { enabled?: boolean },
) {
  const { findById } = useUsers(sdk);
  const enabled = options?.enabled !== false && userId !== null;

  useEffect(() => {
    if (enabled && userId) {
      findById.fetch({ id: userId });
    }
  }, [enabled, userId, findById]);

  return findById;
}
