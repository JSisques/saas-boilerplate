---
title: Users
description: Complete guide to user management
---

The **Users** module provides comprehensive user management capabilities in a multi-tenant SaaS application. It handles user lifecycle, authentication, roles, and status management following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

> **Important:** All user operations require authentication via JWT token. User operations don't require `x-tenant-id` header as they operate on the master database. Users can belong to multiple tenants through tenant members.

## Overview

The Users Module manages user accounts with:

- ✅ User creation, update, and deletion
- ✅ Role-based access control (ADMIN, USER)
- ✅ User status management (ACTIVE, INACTIVE, BLOCKED)
- ✅ Unique username validation
- ✅ GraphQL API with authentication guards
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories

## Authentication & Authorization

All user operations require:

1. **JWT Authentication** - Valid JWT token in `Authorization` header
2. **Role-Based Access** - Users must have appropriate role
3. **OwnerGuard** - Users can only access their own data (unless ADMIN)

**Required Headers:**

```http
Authorization: Bearer <jwt-token>
```

**Note:** User operations don't require `x-tenant-id` header as they operate on the master database.

### Authorization Rules

- **ADMIN Role**: Can perform all operations (create, update, delete, query all users)
- **USER Role**: Can only query own user data and update own profile
- **OwnerGuard**: Ensures users can only update their own profile (unless ADMIN)

### Guards

The module applies the following guards:

1. **JwtAuthGuard** - Validates JWT token and extracts user information
2. **RolesGuard** - Validates user has appropriate role
3. **OwnerGuard** - Validates user can only access their own data (for update operations)

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

## GraphQL API

### Queries

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

**Response:**
```json
{
  "data": {
    "usersFindByCriteria": {
      "items": [
        {
          "id": "user-uuid",
          "userName": "johndoe",
          "name": "John",
          "lastName": "Doe",
          "role": "USER",
          "status": "ACTIVE",
          "createdAt": "2025-01-01T00:00:00.000Z"
        }
      ],
      "total": 1,
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

### Mutations

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

**Business Rules:**
- Username must be unique if provided
- Role is required (defaults to USER)
- Status defaults to ACTIVE if not provided

**Events Published:**
- `UserCreatedEvent` - Published when user is created

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

**Response:**
```json
{
  "data": {
    "updateUser": {
      "success": true,
      "message": "User updated successfully",
      "id": "user-uuid"
    }
  }
}
```

**Business Rules:**
- User must exist
- Username must be unique if changed
- Users can only update their own profile (unless ADMIN)

**Events Published:**
- `UserUpdatedEvent` - Published when user is updated

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

**Response:**
```json
{
  "data": {
    "deleteUser": {
      "success": true,
      "message": "User deleted successfully",
      "id": "user-uuid"
    }
  }
}
```

**Business Rules:**
- User must exist
- Only ADMIN can delete users

**Events Published:**
- `UserDeletedEvent` - Published when user is deleted

## Domain Events

The Users module publishes the following domain events:

### UserCreatedEvent

Published when a user is created.

**Handler:** `UserCreatedEventHandler`

**Process:**
1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

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

## Value Objects

The module uses value objects to ensure data integrity:

- **UserNameValueObject** - Validates user first name
- **UserLastNameValueObject** - Validates user last name
- **UserUserNameValueObject** - Validates and ensures unique username
- **UserBioValueObject** - Validates user bio
- **UserAvatarUrlValueObject** - Validates avatar URL
- **UserRoleValueObject** - Validates user role enum
- **UserStatusValueObject** - Validates user status enum

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `UserWriteRepository`
- Uses Prisma ORM for database operations
- **Stores data in Master Database** (not tenant-specific database)
- This allows for cross-tenant user management

**Operations:**
- `findById(id: string): Promise<UserAggregate | null>`
- `findByUserName(userName: string): Promise<UserAggregate | null>`
- `save(user: UserAggregate): Promise<UserAggregate>`
- `delete(id: string): Promise<boolean>`

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `UserReadRepository`
- Uses MongoDB for optimized read performance

**Operations:**
- `findById(id: string): Promise<UserViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<UserViewModel>>`
- `save(userViewModel: UserViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

## Database Schema

### Prisma Schema (Master Database)

Users are stored in the master database, not in tenant-specific databases:

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

  auth    Auth[]
  tenants TenantMember[]

  @@index([userName])
}
```

**Note:** Storing users in the master database allows for:
- Cross-tenant user management
- Centralized user administration
- Efficient user lookup
- Simplified user authentication

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure, optimized for read operations.

## Example Usage

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
