---
title: Subscription
description: GraphQL APIs to manage tenant subscriptions.
---

## Overview

The subscription module covers operations that create and maintain each tenant’s active subscription. All examples target `POST http://localhost:4100/graphql`.

> The same endpoint handles queries and mutations. Use Apollo Studio, GraphiQL, or any HTTP client to execute requests.

## Authentication & Authorization

- Include `Authorization: Bearer <token>` with a valid JWT.
- Resolvers use `JwtAuthGuard` and `RolesGuard`.
- Access requires the `USER` role (`@Roles(UserRoleEnum.USER)`); typically the tenant owner invokes these operations.

## Common Inputs & Types

- `BaseFilterInput`: combine filters with `FilterOperator` (`EQUALS`, `NOT_EQUALS`, `LIKE`, `IN`, `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_OR_EQUAL`, `LESS_THAN_OR_EQUAL`).
- `BaseSortInput`: order results via `SortDirection` (`ASC`, `DESC`).
- `BasePaginationInput`: configure pagination with `page` (1-indexed) and `perPage`.
- `PaginatedSubscriptionResultDto`: wraps `items` with pagination metadata (`total`, `page`, `perPage`, `totalPages`).

### SubscriptionResponseDto

| Field                  | Type                      | Notes                                               |
| ---------------------- | ------------------------- | --------------------------------------------------- |
| `id`                   | `String!`                 | Unique subscription identifier.                     |
| `tenantId`             | `String!`                 | Tenant owning the subscription (unique per tenant). |
| `planId`               | `String!`                 | Associated subscription plan.                       |
| `startDate`            | `String!`                 | ISO-8601 start date.                                |
| `endDate`              | `DateTime!`               | ISO-8601 expiration date.                           |
| `trialEndDate`         | `DateTime`                | `null` when not in trial.                           |
| `status`               | `SubscriptionStatusEnum!` | Current lifecycle status.                           |
| `stripeSubscriptionId` | `String`                  | External Stripe subscription reference.             |
| `stripeCustomerId`     | `String`                  | External Stripe customer reference.                 |
| `renewalMethod`        | `RenewalMethodEnum!`      | Automatic vs. manual renewals.                      |

> Supply date values as ISO strings (for example, `2025-01-15T00:00:00.000Z`). NestJS converts them into `Date` instances.

## Query: `subscriptionFindByCriteria`

- **Purpose**: Fetch subscriptions using filters, sorts, and pagination.
- **Arguments**: Optional `input` (`SubscriptionFindByCriteriaRequestDto`)

```graphql
query SubscriptionsByPlan {
  subscriptionFindByCriteria(
    input: {
      filters: [{ field: "planId", operator: EQUALS, value: "plan-uuid" }]
      pagination: { page: 1, perPage: 5 }
    }
  ) {
    total
    items {
      id
      tenantId
      planId
      status
      renewalMethod
      endDate
    }
  }
}
```

## Query: `subscriptionFindById`

- **Purpose**: Retrieve the detailed view model for a single subscription.
- **Arguments**: `input` (`SubscriptionFindByIdRequestDto`) with the subscription `id`.

```graphql
query SubscriptionById {
  subscriptionFindById(input: { id: "subscription-uuid" }) {
    id
    tenantId
    planId
    status
    startDate
    endDate
    stripeSubscriptionId
  }
}
```

## Query: `subscriptionFindByTenantId`

- **Purpose**: Fetch the subscription owned by a tenant.
- **Arguments**: `input` (`SubscriptionFindByTenantIdRequestDto`) with `tenantId`.

```graphql
query SubscriptionByTenant {
  subscriptionFindByTenantId(input: { tenantId: "tenant-uuid" }) {
    id
    planId
    status
    renewalMethod
  }
}
```

## Mutation Inputs

| Mutation                 | Required Role | Input DTO                          | Notes                                                                     |
| ------------------------ | ------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| `subscriptionCreate`     | `USER`        | `SubscriptionCreateRequestDto`     | Creates a tenant subscription. All fields except Stripe IDs are required. |
| `subscriptionUpdate`     | `USER`        | `SubscriptionUpdateRequestDto`     | Partial updates; include only fields to change.                           |
| `subscriptionDelete`     | `USER`        | `SubscriptionDeleteRequestDto`     | Removes the subscription by `id`.                                         |
| `subscriptionActivate`   | `USER`        | `SubscriptionActivateRequestDto`   | Sets status to `ACTIVE`.                                                  |
| `subscriptionDeactivate` | `USER`        | `SubscriptionDeactivateRequestDto` | Sets status to `INACTIVE`.                                                |
| `subscriptionCancel`     | `USER`        | `SubscriptionCancelRequestDto`     | Marks the subscription as `CANCELLED`.                                    |
| `subscriptionRefund`     | `USER`        | `SubscriptionRefundRequestDto`     | Marks the subscription as `REFUNDED`.                                     |

## Mutation: `subscriptionCreate`

```graphql
mutation CreateSubscription {
  subscriptionCreate(
    input: {
      tenantId: "tenant-uuid"
      planId: "plan-uuid"
      startDate: "2025-01-01T00:00:00.000Z"
      endDate: "2025-12-31T23:59:59.000Z"
      stripeSubscriptionId: "sub_123"
      stripeCustomerId: "cus_123"
      renewalMethod: AUTOMATIC
    }
  ) {
    success
    message
    id
  }
}
```

## Mutation: `subscriptionUpdate`

```graphql
mutation UpdateSubscription {
  subscriptionUpdate(
    input: {
      id: "subscription-uuid"
      planId: "new-plan-id"
      endDate: "2025-06-30T23:59:59.000Z"
      status: ACTIVE
      renewalMethod: MANUAL
    }
  ) {
    success
    message
    id
  }
}
```

## Mutation: Lifecycle Helpers

```graphql
mutation SubscriptionLifecycle {
  activate: subscriptionActivate(input: { id: "subscription-uuid" }) {
    success
    message
  }
  deactivate: subscriptionDeactivate(input: { id: "subscription-uuid" }) {
    success
    message
  }
  cancel: subscriptionCancel(input: { id: "subscription-uuid" }) {
    success
    message
  }
  refund: subscriptionRefund(input: { id: "subscription-uuid" }) {
    success
    message
  }
  delete: subscriptionDelete(input: { id: "subscription-uuid" }) {
    success
    message
  }
}
```

> Each lifecycle mutation returns a `MutationResponseDto`. When `success` is `true`, the `id` field echoes the affected subscription. Validation failures (non-existing subscription, tenant mismatches, etc.) appear as GraphQL errors.

## Enumerations

- `RenewalMethodEnum`: `MANUAL`, `AUTOMATIC`
- `SubscriptionStatusEnum`: `ACTIVE`, `INACTIVE`, `CANCELLED`, `REFUNDED`

## Error Handling

- Validation errors raised by class-validator are surfaced as GraphQL errors with the `BAD_USER_INPUT` code.
- Domain-specific issues (for example, tenant already has a subscription) bubble up as standard GraphQL errors with contextual messages.
