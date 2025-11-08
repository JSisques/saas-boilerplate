---
title: Subscription Plan
description: GraphQL APIs to manage subscription plan definitions.
---

## Overview

The subscription plan module exposes GraphQL operations to create, update, list, and delete plans. Examples target the default endpoint `POST http://localhost:4100/graphql`.

> Use the same endpoint for both queries and mutations. Apollo Studio, GraphiQL, or any HTTP client can execute the snippets.

## Authentication & Authorization

- Every request must include `Authorization: Bearer <token>` with a valid JWT.
- All resolvers are protected by `JwtAuthGuard` and `RolesGuard`.
- Only users with the `ADMIN` role can access plan operations (`@Roles(UserRoleEnum.ADMIN)`).

## Common Inputs & Types

- `BaseFilterInput`: combine simple filters with `FilterOperator` (`EQUALS`, `NOT_EQUALS`, `LIKE`, `IN`, `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_OR_EQUAL`, `LESS_THAN_OR_EQUAL`).
- `BaseSortInput`: control ordering via `SortDirection` (`ASC`, `DESC`).
- `BasePaginationInput`: provide `page` (1-indexed) and `perPage` values.
- `PaginatedSubscriptionPlanResultDto`: wraps `items` with pagination metadata (`total`, `page`, `perPage`, `totalPages`).

### SubscriptionPlanResponseDto

| Field             | Type        | Notes                                      |
| ----------------- | ----------- | ------------------------------------------ |
| `id`              | `String!`   | Unique plan identifier.                    |
| `name`            | `String!`   | Human readable name.                       |
| `slug`            | `String!`   | Unique slug generated on create.           |
| `type`            | `String`    | Value from `SubscriptionPlanTypeEnum`.     |
| `description`     | `String`    | Optional marketing copy.                   |
| `priceMonthly`    | `Float!`    | Current monthly price.                     |
| `priceYearly`     | `Float!`    | Current yearly price.                      |
| `currency`        | `String!`   | Value from `CurrencyEnum`.                 |
| `interval`        | `String!`   | `SubscriptionPlanIntervalEnum` value.      |
| `intervalCount`   | `Float!`    | Number of intervals per billing cycle.     |
| `trialPeriodDays` | `Float!`    | `null` when no trial is offered.           |
| `isActive`        | `Boolean!`  | Plan availability flag.                    |
| `features`        | `[String!]` | Optional list or JSON-encoded feature set. |
| `limits`          | `[String!]` | Optional list or JSON-encoded quotas.      |
| `stripePriceId`   | `String`    | External Stripe price reference.           |

> The resolver returns `priceMonthly` and `priceYearly` as floats; the underlying Prisma model stores decimals.

## Query: `subscriptionPlanFindByCriteria`

- **Purpose**: Retrieve plans with optional filtering, sorting, and pagination.
- **Arguments**: Optional `input` (`SubscriptionPlanFindByCriteriaRequestDto`)
- **Response**: `PaginatedSubscriptionPlanResultDto`

```graphql
query SubscriptionPlans {
  subscriptionPlanFindByCriteria(
    input: {
      filters: [{ field: "type", operator: EQUALS, value: "PRO" }]
      sorts: [{ field: "priceMonthly", direction: ASC }]
      pagination: { page: 1, perPage: 10 }
    }
  ) {
    total
    items {
      id
      name
      type
      priceMonthly
      currency
      interval
      intervalCount
      isActive
    }
  }
}
```

## Mutation: `subscriptionPlanCreate`

- **Purpose**: Register a new plan.
- **Arguments**: `input` (`SubscriptionPlanCreateRequestDto`)
- **Response**: `MutationResponseDto` containing the created `id`.

```graphql
mutation CreatePlan {
  subscriptionPlanCreate(
    input: {
      name: "Pro"
      type: PRO
      description: "Full access to premium features."
      priceMonthly: 49.0
      currency: USD
      interval: MONTHLY
      intervalCount: 1
      trialPeriodDays: 14
      features: ["priority_support", "unlimited_projects"]
      limits: ["seats:10", "storage_gb:100"]
      stripePriceId: "price_123"
    }
  ) {
    success
    message
    id
  }
}
```

## Mutation: `subscriptionPlanUpdate`

- **Purpose**: Modify plan metadata or pricing. Provide only the fields to change.
- **Arguments**: `input` (`SubscriptionPlanUpdateRequestDto`)

```graphql
mutation UpdatePlan {
  subscriptionPlanUpdate(
    input: {
      id: "plan-uuid"
      priceMonthly: 59.0
      description: "Updated pricing effective Q2."
    }
  ) {
    success
    message
    id
  }
}
```

## Mutation: `subscriptionPlanDelete`

- **Purpose**: Remove a plan by ID.
- **Arguments**: `input` (`SubscriptionPlanDeleteRequestDto`)

```graphql
mutation DeletePlan {
  subscriptionPlanDelete(input: { id: "plan-uuid" }) {
    success
    message
    id
  }
}
```

## Enumerations

- `SubscriptionPlanIntervalEnum`: `MONTHLY`, `YEARLY`
- `SubscriptionPlanTypeEnum`: `FREE`, `BASIC`, `PRO`, `ENTERPRISE`
- `CurrencyEnum`: `USD`, `EUR`

## Error Handling

- Validation failures from class-validator (missing required fields, invalid enum values, etc.) are surfaced as GraphQL errors with the `BAD_USER_INPUT` code.
- Domain-specific errors (for example, duplicate slugs) propagate as regular GraphQL errors with descriptive messages from the command handlers.
