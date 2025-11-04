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
  const findByCriteria = useAsyncState<PaginatedUserResult>(
    (input?: UserFindByCriteriaInput) => sdk.users.findByCriteria(input),
  );

  const findById = useAsyncState<UserResponse>((input: UserFindByIdInput) =>
    sdk.users.findById(input),
  );

  const create = useAsyncState<MutationResponse>((input: CreateUserInput) =>
    sdk.users.create(input),
  );

  const update = useAsyncState<MutationResponse>((input: UpdateUserInput) =>
    sdk.users.update(input),
  );

  const remove = useAsyncState<MutationResponse>((input: DeleteUserInput) =>
    sdk.users.delete(input),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, input?.pagination?.page, input?.pagination?.perPage]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, userId]);

  return findById;
}
