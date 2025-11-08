---
title: Events
description: GraphQL APIs to explore and replay domain events.
---

## Overview

The event store module exposes GraphQL endpoints to inspect historical domain events and trigger replays. Use them for auditing, debugging, or rebuilding projections. Examples target `POST http://localhost:4100/graphql`, combining the global prefix and versioning used by the NestJS app.

> Queries and mutations share the same GraphQL endpoint; you can execute requests with GraphiQL, Apollo Studio, or any HTTP client.

## Authentication & Authorization

- No guards are applied in the current resolver implementation. Protect these endpoints through API gateway rules, custom guards, or network segmentation before exposing them publicly.

## Common Inputs & Types

- `BaseFilterInput`: leverage filters with `FilterOperator` (`EQUALS`, `NOT_EQUALS`, `LIKE`, `IN`, `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_OR_EQUAL`, `LESS_THAN_OR_EQUAL`).
- `BaseSortInput`: order results via `SortDirection` (`ASC`, `DESC`).
- `BasePaginationInput`: specify `page` (1-indexed) and `perPage`.
- `PaginatedEventResultDto`: wraps paginated metadata (`total`, `page`, `perPage`, `totalPages`) together with the event `items`.

### EventResponseDto

| Field           | Type       | Notes                                               |
| --------------- | ---------- | --------------------------------------------------- |
| `id`            | `String!`  | Unique event identifier.                            |
| `eventType`     | `String`   | Domain-specific event name (e.g. `tenant.created`). |
| `aggregateType` | `String`   | Aggregate that emitted the event.                   |
| `aggregateId`   | `String`   | Aggregate instance identifier.                      |
| `payload`       | `String`   | Serialized JSON payload.                            |
| `timestamp`     | `DateTime` | Time the event was recorded.                        |

## Query: `eventsFindByCriteria`

- **Purpose**: Search events with optional filters, sorting and pagination.
- **Arguments**: Optional `input` (`EventFindByCriteriaRequestDto`)
- **Response**: `PaginatedEventResultDto`

```graphql
query EventsByAggregate {
  eventsFindByCriteria(
    input: {
      filters: [
        { field: "aggregateType", operator: EQUALS, value: "Tenant" }
        { field: "eventType", operator: LIKE, value: "updated" }
      ]
      sorts: [{ field: "timestamp", direction: DESC }]
      pagination: { page: 1, perPage: 20 }
    }
  ) {
    total
    items {
      id
      eventType
      aggregateId
      timestamp
    }
  }
}
```

## Mutation: `eventsReplay`

- **Purpose**: Re-run events that match the provided filters, typically to rebuild read models.
- **Arguments**: `input` (`EventReplayRequestDto`)
- **Response**: `MutationResponseDto` with the number of replayed events in the message.

```graphql
mutation ReplayTenantEvents {
  eventsReplay(
    input: {
      aggregateType: "Tenant"
      from: "2025-01-01T00:00:00.000Z"
      to: "2025-02-01T00:00:00.000Z"
      batchSize: 500
    }
  ) {
    success
    message
  }
}
```

### Replay Input Reference

| Field           | Type        | Required | Notes                                                               |
| --------------- | ----------- | -------- | ------------------------------------------------------------------- |
| `id`            | `String`    | No       | Replay a specific event by ID. Overrides other filters if provided. |
| `eventType`     | `String`    | No       | Limit replay to a particular event type.                            |
| `aggregateId`   | `String`    | No       | Restrict to one aggregate instance (UUID).                          |
| `aggregateType` | `String`    | No       | Restrict to a specific aggregate type (e.g. `Tenant`).              |
| `from`          | `DateTime!` | Yes      | Inclusive lower bound of the time range.                            |
| `to`            | `DateTime!` | Yes      | Inclusive upper bound of the time range.                            |
| `batchSize`     | `Int`       | No       | Chunk size used while replaying events.                             |

> When replaying events, ensure consumers are idempotent. Replays can mutate downstream projections or integrations if handlers are not designed for reentrancy.

## Error Handling

- Validation issues (missing required dates, invalid UUIDs, etc.) surface as GraphQL errors with the `BAD_USER_INPUT` code.
- Domain-level issues (for example, repository failures) bubble up as standard GraphQL errors with messages from the command/query handlers.
