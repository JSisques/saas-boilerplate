"use client";

import { useSDK } from "@/shared/presentation/hooks/use-sdk";
import type {
  MutationResponse,
  PaginatedSubscriptionPlanResult,
  SubscriptionPlanCreateInput,
  SubscriptionPlanDeleteInput,
  SubscriptionPlanFindByCriteriaInput,
  SubscriptionPlanResponse,
  SubscriptionPlanUpdateInput,
} from "@repo/sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query keys factory for subscription plan queries
 * This pattern makes it easy to invalidate related queries
 */
export const subscriptionPlanQueryKeys = {
  all: ["subscriptionPlans"] as const,
  lists: () => [...subscriptionPlanQueryKeys.all, "list"] as const,
  list: (input?: SubscriptionPlanFindByCriteriaInput) =>
    [...subscriptionPlanQueryKeys.lists(), input] as const,
  details: () => [...subscriptionPlanQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...subscriptionPlanQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch subscription plans list with React Query
 */
export function useSubscriptionPlans(
  input?: SubscriptionPlanFindByCriteriaInput,
  options?: { enabled?: boolean }
) {
  const sdk = useSDK();
  return useQuery<PaginatedSubscriptionPlanResult, Error>({
    queryKey: subscriptionPlanQueryKeys.list(input),
    queryFn: () => sdk.subscriptionPlans.findByCriteria(input),
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to fetch a single subscription plan by ID
 */
export function useSubscriptionPlan(
  subscriptionPlanId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const sdk = useSDK();
  return useQuery<SubscriptionPlanResponse | null, Error>({
    queryKey: subscriptionPlanQueryKeys.detail(subscriptionPlanId || ""),
    queryFn: async () => {
      if (!subscriptionPlanId) return null;
      return sdk.subscriptionPlans.findById({ id: subscriptionPlanId });
    },
    enabled: options?.enabled !== false && !!subscriptionPlanId,
  });
}

/**
 * Hook to create a new subscription plan
 */
export function useCreateSubscriptionPlan() {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, SubscriptionPlanCreateInput>({
    mutationFn: (input) => sdk.subscriptionPlans.create(input),
    onSuccess: () => {
      // Invalidate subscription plans list to refetch
      queryClient.invalidateQueries({
        queryKey: subscriptionPlanQueryKeys.lists(),
      });
    },
  });
}

/**
 * Hook to update a subscription plan
 */
export function useUpdateSubscriptionPlan() {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, SubscriptionPlanUpdateInput>({
    mutationFn: (input) => sdk.subscriptionPlans.update(input),
    onSuccess: (_, variables) => {
      // Invalidate specific subscription plan and subscription plans list
      queryClient.invalidateQueries({
        queryKey: subscriptionPlanQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionPlanQueryKeys.lists(),
      });
    },
  });
}

/**
 * Hook to delete a subscription plan
 */
export function useDeleteSubscriptionPlan() {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, SubscriptionPlanDeleteInput>({
    mutationFn: (input) => sdk.subscriptionPlans.delete(input),
    onSuccess: (_, variables) => {
      // Remove subscription plan from cache and invalidate list
      queryClient.removeQueries({
        queryKey: subscriptionPlanQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionPlanQueryKeys.lists(),
      });
    },
  });
}
