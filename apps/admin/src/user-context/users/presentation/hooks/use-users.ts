"use client";

import type {
  CreateUserInput,
  DeleteUserInput,
  MutationResponse,
  PaginatedUserResult,
  UpdateUserInput,
  UserFindByCriteriaInput,
  UserResponse,
} from "@repo/sdk";
import { useSDK } from "@repo/shared/presentation/hooks/use-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query keys factory for user queries
 * This pattern makes it easy to invalidate related queries
 */
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (input?: UserFindByCriteriaInput) =>
    [...userQueryKeys.lists(), input] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch users list with React Query
 */
export function useUsers(
  input?: UserFindByCriteriaInput,
  options?: { enabled?: boolean }
) {
  const sdk = useSDK();
  return useQuery<PaginatedUserResult, Error>({
    queryKey: userQueryKeys.list(input),
    queryFn: () => sdk.users.findByCriteria(input),
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(
  userId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const sdk = useSDK();
  return useQuery<UserResponse | null, Error>({
    queryKey: userQueryKeys.detail(userId || ""),
    queryFn: async () => {
      if (!userId) return null;
      return sdk.users.findById({ id: userId });
    },
    enabled: options?.enabled !== false && !!userId,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, CreateUserInput>({
    mutationFn: (input) => sdk.users.create(input),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, UpdateUserInput>({
    mutationFn: (input) => sdk.users.update(input),
    onSuccess: (_, variables) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, DeleteUserInput>({
    mutationFn: (input) => sdk.users.delete(input),
    onSuccess: (_, variables) => {
      // Remove user from cache and invalidate list
      queryClient.removeQueries({
        queryKey: userQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}
