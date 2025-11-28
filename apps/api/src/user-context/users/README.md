# Users Module

A comprehensive module for managing users in a multi-tenant SaaS application. This module handles user lifecycle, authentication, roles, and status management. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [User Roles](#user-roles)
- [User Status](#user-status)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Users Module provides a complete solution for managing users in a multi-tenant SaaS application. It handles user creation, updates, deletion, role management, and status tracking.

### Features

- ✅ User creation, update, and deletion
- ✅ Role-based access control (ADMIN, USER)
- ✅ User status management (ACTIVE, INACTIVE, BLOCKED)
- ✅ Unique username validation
- ✅ GraphQL API for user operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates
- ✅ Authentication and authorization guards

## Architecture

The module is organized following Clean Architecture principles:

```
users/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── user-create/
│   │   ├── user-update/
│   │   └── delete-user/
│   ├── queries/             # Query handlers
│   │   ├── user-find-by-id/
│   │   ├── find-users-by-criteria/
│   │   └── user-view-model-find-by-id/
│   ├── event-handlers/      # Event handlers
│   │   ├── user-created/
│   │   ├── user-updated/
│   │   └── user-deleted/
│   ├── services/           # Application services
│   │   ├── assert-user-exsits/
│   │   ├── assert-user-username-is-unique/
│   │   └── assert-user-view-model-exsits/
│   └── exceptions/         # Application exceptions
│       ├── user-not-found/
│       └── user-username-is-not-unique/
├── domain/                  # Domain layer
│   ├── aggregates/          # User aggregate
│   │   └── user.aggregate.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── user-write.repository.ts
│   │   └── user-read.repository.ts
│   ├── value-objects/      # Value objects
│   │   ├── user-name/
│   │   ├── user-last-name/
│   │   ├── user-user-name/
│   │   ├── user-bio/
│   │   ├── user-avatar-url/
│   │   ├── user-role/
│   │   └── user-status/
│   ├── view-models/        # Read models
│   │   └── user.view-model.ts
│   ├── factories/          # Domain factories
│   │   ├── user-aggregate.factory.ts
│   │   └── user-view-model.factory.ts
│   ├── enums/             # Domain enums
│   │   ├── user-role.enum.ts
│   │   └── user-status.enum.ts
│   └── primitives/        # Domain primitives
│       └── user.primitives.ts
├── infrastructure/         # Infrastructure layer
│   └── database/          # Database repositories
│       ├── prisma/        # Write repository (Prisma/PostgreSQL - Master DB)
│       └── mongodb/       # Read repository (MongoDB)
└── transport/             # Transport layer
    └── graphql/          # GraphQL resolvers and DTOs
        ├── resolvers/
        ├── dtos/
        └── mappers/
```

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

- **Commands**: Write operations (create, update, delete) that modify state
- **Queries**: Read operations (findById, findByCriteria) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Master database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `UserCreatedEvent` - Published when a user is created
- `UserUpdatedEvent` - Published when a user is updated
- `UserDeletedEvent` - Published when a user is deleted

Events are handled asynchronously to update read models and trigger side effects.

#### Multi-Tenant Architecture

- Users are stored in the master database (not tenant-specific)
- This allows for cross-tenant user management
- Users can belong to multiple tenants through tenant members
- **Note:** User operations don't require `x-tenant-id` header as they operate on the master database

## Domain Model

### User Aggregate

The `UserAggregate` is the main domain entity that encapsulates user business logic:

```typescript
class UserAggregate {
  id: UserUuidValueObject
  userName: UserUserNameValueObject | null
  name: UserNameValueObject | null
  lastName: UserLastNameValueObject | null
  bio: UserBioValueObject | null
  avatarUrl: UserAvatarUrlValueObject | null
  role: UserRoleValueObject
  status: UserStatusValueObject
  createdAt: DateValueObject
  updatedAt: DateValueObject
}
```

**Methods:**
- `update(props, generateEvent)`: Updates user properties
- `delete(generateEvent)`: Marks user as deleted
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **UserNameValueObject**: Validates user first name
- **UserLastNameValueObject**: Validates user last name
- **UserUserNameValueObject**: Validates and ensures unique username
- **UserBioValueObject**: Validates user bio
- **UserAvatarUrlValueObject**: Validates avatar URL
- **UserRoleValueObject**: Validates user role enum
- **UserStatusValueObject**: Validates user status enum

### View Model

The `UserViewModel` is optimized for read operations and stored in MongoDB for fast querying. View models are automatically synchronized via event handlers.

## User Roles

Users can have one of two roles:

### ADMIN

Administrative access to the system.

**Permissions:**
- Full system access
- Can manage all users
- Can create, update, and delete users
- Can access all tenants
- Highest level of access

### USER

Standard user access.

**Permissions:**
- Limited system access
- Can only update own profile (via OwnerGuard)
- Can access tenants they are members of
- Cannot manage other users

## User Status

Users can have one of three statuses:

### ACTIVE

The user is active and can login to the system.

**Characteristics:**
- User can authenticate
- User can access the system
- Default status for new users

### INACTIVE

The user is inactive and cannot login to the system.

**Characteristics:**
- User cannot authenticate
- User cannot access the system
- Can be reactivated later

### BLOCKED

The user is blocked and cannot login to the system.

**Characteristics:**
- User cannot authenticate
- User cannot access the system
- Requires manual intervention to unblock

## Commands

Commands represent write operations that modify state:

### UserCreateCommand

Creates a new user.

**Handler:** `UserCreateCommandHandler`

**Process:**
1. Asserts username is unique (if provided)
2. Creates user aggregate
3. Saves aggregate to write repository (Prisma - Master database)
4. Publishes `UserCreatedEvent`
5. Returns user ID

**Input:**
```typescript
{
  userName?: string  // Optional, must be unique if provided
  name?: string
  lastName?: string
  bio?: string
  avatarUrl?: string
  role: UserRoleEnum  // Required, defaults to USER
  status?: UserStatusEnum  // Optional, defaults to ACTIVE
}
```

**Output:** `string` (user ID)

**Business Rules:**
- Username must be unique if provided
- Role is required (defaults to USER)
- Status defaults to ACTIVE if not provided

### UserUpdateCommand

Updates an existing user's properties.

**Handler:** `UserUpdateCommandHandler`

**Process:**
1. Asserts user exists
2. Updates aggregate properties
3. Saves aggregate to write repository
4. Publishes `UserUpdatedEvent`

**Input:**
```typescript
{
  id: string  // Required
  userName?: string | null
  name?: string | null
  lastName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  role?: UserRoleEnum
  status?: UserStatusEnum
}
```

**Output:** `void`

**Business Rules:**
- User must exist
- Username must be unique if changed
- Users can only update their own profile (unless ADMIN)

### UserDeleteCommand

Deletes a user from the system.

**Handler:** `UserDeleteCommandHandler`

**Process:**
1. Asserts user exists
2. Marks aggregate as deleted
3. Deletes record from write repository (soft delete)
4. Publishes `UserDeletedEvent`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `void`

**Business Rules:**
- User must exist
- Only ADMIN can delete users

## Queries

Queries represent read operations that don't modify state:

### UserFindByIdQuery

Finds a user aggregate by ID.

**Handler:** `UserFindByIdQueryHandler`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `UserAggregate`

### FindUsersByCriteriaQuery

Finds users by criteria with pagination.

**Handler:** `FindUsersByCriteriaQueryHandler`

**Input:**
```typescript
{
  criteria: Criteria {
    filters?: Filter[]
    sorts?: Sort[]
    pagination?: Pagination
  }
}
```

**Output:** `PaginatedResult<UserViewModel>`

### UserViewModelFindByIdQuery

Finds a user view model by ID (optimized for read operations).

**Handler:** `UserViewModelFindByIdQueryHandler`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `UserViewModel`

## Events

The module publishes domain events for important state changes:

### UserCreatedEvent

Published when a user is created.

**Handler:** `UserCreatedEventHandler`

**Process:**
1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

This ensures read models are synchronized with write models.

### UserUpdatedEvent

Published when a user is updated.

**Handler:** `UserUpdatedEventHandler`

**Process:**
1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

### UserDeletedEvent

Published when a user is deleted.

**Handler:** `UserDeletedEventHandler`

**Process:**
1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `UserWriteRepository`

**Implementation:** `UserPrismaRepository`

**Database:** PostgreSQL (Master database)

**Operations:**
- `findById(id: string): Promise<UserAggregate | null>`
- `findByUserName(userName: string): Promise<UserAggregate | null>`
- `save(user: UserAggregate): Promise<UserAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Stores users in master database (not tenant-specific)
- Allows cross-tenant user management
- Indexed on `userName` for performance
- Soft delete support

### Read Repository (MongoDB)

**Interface:** `UserReadRepository`

**Implementation:** `UserMongoRepository`

**Database:** MongoDB

**Operations:**
- `findById(id: string): Promise<UserViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<UserViewModel>>`
- `save(userViewModel: UserViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

All user operations require authentication. The module uses multiple guards to ensure security.

### Required Headers

Every request to the users API must include:

1. **Authorization Header** - JWT token for authentication
   ```http
   Authorization: Bearer <jwt-token>
   ```

**Note:** User operations don't require `x-tenant-id` header as they operate on the master database.

### Guards

The module applies the following guards to all endpoints:

1. **JwtAuthGuard** - Validates JWT token and extracts user information
2. **RolesGuard** - Validates user has appropriate role
3. **OwnerGuard** - Validates user can only access their own data (for update operations)

### Authorization Rules

- **ADMIN Role**: Can perform all operations (create, update, delete, query all users)
- **USER Role**: Can only query own user data and update own profile
- **OwnerGuard**: Ensures users can only update their own profile (unless ADMIN)

### UserQueryResolver

Handles read operations (queries).

**Queries:**

#### usersFindByCriteria

Finds users by criteria with pagination. **Requires ADMIN role.**

```graphql
query FindUsersByCriteria($input: UserFindByCriteriaRequestDto) {
  usersFindByCriteria(input: $input) {
    items {
      id
      userName
      name
      lastName
      role
      status
      createdAt
    }
    total
    page
    limit
  }
}
```

**Variables:**
```json
{
  "input": {
    "filters": [
      {
        "field": "role",
        "operator": "EQUALS",
        "value": "USER"
      }
    ],
    "sorts": [
      {
        "field": "createdAt",
        "direction": "DESC"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

#### userFindById

Finds a user by ID. **Requires OwnerGuard (users can only view their own data, unless ADMIN).**

```graphql
query FindUserById($input: UserFindByIdRequestDto!) {
  userFindById(input: $input) {
    id
    userName
    name
    lastName
    bio
    avatarUrl
    role
    status
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "user-uuid"
  }
}
```

### UserMutationsResolver

Handles write operations (mutations).

**Mutations:**

#### createUser

Creates a new user. **Requires ADMIN role.**

```graphql
mutation CreateUser($input: CreateUserRequestDto!) {
  createUser(input: $input) {
    success
    message
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "userName": "johndoe",
    "name": "John",
    "lastName": "Doe",
    "bio": "Software developer",
    "avatarUrl": "https://example.com/avatar.jpg",
    "role": "USER"
  }
}
```

**Response:**
```json
{
  "data": {
    "createUser": {
      "success": true,
      "message": "User created successfully",
      "id": "user-uuid"
    }
  }
}
```

#### updateUser

Updates an existing user. **Requires OwnerGuard (users can only update their own profile, unless ADMIN).**

```graphql
mutation UpdateUser($input: UpdateUserRequestDto!) {
  updateUser(input: $input) {
    success
    message
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "user-uuid",
    "name": "John Updated",
    "bio": "Updated bio",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
}
```

#### deleteUser

Deletes a user. **Requires ADMIN role.**

```graphql
mutation DeleteUser($input: DeleteUserRequestDto!) {
  deleteUser(input: $input) {
    success
    message
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "user-uuid"
  }
}
```

## Examples

### Complete User Lifecycle

```graphql
# 1. Create user (ADMIN only)
mutation {
  createUser(input: {
    userName: "johndoe"
    name: "John"
    lastName: "Doe"
    bio: "Software developer"
    role: USER
  }) {
    success
    message
    id
  }
}

# 2. Find users by criteria (ADMIN only)
query {
  usersFindByCriteria(input: {
    filters: [
      {
        field: "role"
        operator: EQUALS
        value: "USER"
      }
    ]
    pagination: {
      page: 1
      limit: 10
    }
  }) {
    items {
      id
      userName
      name
      role
      status
    }
    total
  }
}

# 3. Find user by ID (OwnerGuard - own data only)
query {
  userFindById(input: { id: "user-uuid" }) {
    id
    userName
    name
    lastName
    bio
    avatarUrl
  }
}

# 4. Update user (OwnerGuard - own profile only)
mutation {
  updateUser(input: {
    id: "user-uuid"
    name: "John Updated"
    bio: "Updated bio"
  }) {
    success
    message
  }
}

# 5. Delete user (ADMIN only)
mutation {
  deleteUser(input: {
    id: "user-uuid"
  }) {
    success
    message
  }
}
```

### Query with Filters

```graphql
query {
  usersFindByCriteria(input: {
    filters: [
      {
        field: "status"
        operator: EQUALS
        value: "ACTIVE"
      }
      {
        field: "role"
        operator: EQUALS
        value: "USER"
      }
    ]
    sorts: [
      {
        field: "createdAt"
        direction: DESC
      }
    ]
    pagination: {
      page: 1
      limit: 20
    }
  }) {
    items {
      id
      userName
      name
      lastName
      role
      status
      createdAt
    }
    total
    page
    limit
  }
}
```

## Troubleshooting

### Common Issues

1. **User Not Found:**
   - Solution: Verify the user ID exists
   - Check if the user was soft deleted

2. **Username Is Not Unique:**
   - Solution: Username must be unique across all users
   - Use a different username
   - Error: `UserUsernameIsNotUniqueException`

3. **Unauthorized Access:**
   - Solution: Ensure JWT token is valid
   - Check user has appropriate role (ADMIN for create/delete, USER for own data)
   - Verify OwnerGuard allows access to the resource

4. **Cannot Update Other Users:**
   - Solution: Only ADMIN can update other users
   - Regular users can only update their own profile
   - Use OwnerGuard to ensure proper access control

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:
- User create/update/delete operations
- Repository operations
- Event handling
- Guard validation

## Database Schema

### Prisma Schema (Master Database)

```prisma
enum UserRoleEnum {
  ADMIN
  USER
}

enum StatusEnum {
  ACTIVE
  INACTIVE
  BLOCKED
}

model User {
  id        String       @id @default(uuid())
  userName  String?      @unique
  name      String?
  lastName  String?
  bio       String?
  avatarUrl String?
  role      UserRoleEnum
  status    StatusEnum

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([userName])
}
```

**Note:** Users are stored in the master database, not in tenant-specific databases. This allows for:
- Cross-tenant user management
- Centralized user administration
- Efficient user lookup
- Simplified user authentication

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure as the Prisma model, optimized for read operations.

## Best Practices

1. **Username Uniqueness** - Ensure usernames are unique across all users
2. **Status Management** - Use INACTIVE for temporary deactivation, BLOCKED for violations
3. **Role Management** - Assign ADMIN role carefully, only to trusted users
4. **Event Handling** - Subscribe to user events for cross-module integration
5. **Validation** - All value objects validate input data automatically
6. **OwnerGuard** - Use OwnerGuard to ensure users can only access their own data
7. **Soft Deletes** - Users are soft deleted to maintain audit trail

## Integration with Other Modules

### Tenant Members Module

- Links users to tenants through tenant members
- Validates user existence before adding members

### Auth Context

- Uses user information for authentication
- Validates user status for login
- Uses user roles for authorization

### Tenant Context

- Users can belong to multiple tenants
- Tenant members reference users

## License

This module is part of the SaaS Boilerplate project.

