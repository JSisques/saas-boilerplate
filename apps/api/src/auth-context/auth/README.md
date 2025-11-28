# Auth Module

A comprehensive authentication and authorization module for a multi-tenant SaaS application. This module handles user registration, login, JWT token generation, password hashing, and provides guards for role-based and tenant-based access control. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Authentication Providers](#authentication-providers)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [JWT Authentication](#jwt-authentication)
- [Guards](#guards)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Auth Module provides a complete solution for authentication and authorization in a multi-tenant SaaS application. It handles user registration, login, JWT token management, and provides comprehensive guards for access control.

### Features

- ✅ User registration by email
- ✅ User login by email with password verification
- ✅ JWT token generation (access and refresh tokens)
- ✅ Password hashing and verification (bcrypt)
- ✅ Multiple authentication providers (LOCAL, GOOGLE, APPLE)
- ✅ Email verification support
- ✅ Two-factor authentication support
- ✅ Last login tracking
- ✅ GraphQL API for auth operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ Comprehensive guards (JwtAuthGuard, RolesGuard, OwnerGuard, TenantGuard, TenantRolesGuard)
- ✅ Global module (exports guards and services for use across the application)

## Architecture

The module is organized following Clean Architecture principles:

```
auth/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── auth-login-by-email/
│   │   └── auth-register-by-email/
│   ├── queries/             # Query handlers
│   │   └── find-auths-by-criteria/
│   ├── event-handlers/      # Event handlers
│   │   ├── auth-created/
│   │   ├── auth-logged-in-by-email/
│   │   ├── auth-registered-by-email/
│   │   └── auth-updated/
│   ├── services/           # Application services
│   │   ├── assert-auth-email-exists/
│   │   ├── assert-auth-email-not-exists/
│   │   ├── assert-auth-exsits/
│   │   ├── assert-auth-view-model-exsits/
│   │   ├── jwt-auth/
│   │   └── password-hashing/
│   └── exceptions/         # Application exceptions
│       ├── auth-not-found/
│       ├── auth-email-already-exists/
│       ├── password-hashing-failed/
│       └── password-verification-failed/
├── domain/                  # Domain layer
│   ├── aggregate/          # Auth aggregate
│   │   └── auth.aggregate.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── auth-write.repository.ts
│   │   └── auth-read.repository.ts
│   ├── value-objects/      # Value objects
│   │   ├── auth-email/
│   │   ├── auth-password/
│   │   ├── auth-provider/
│   │   ├── auth-email-verified/
│   │   ├── auth-last-login-at/
│   │   └── auth-two-factor-enabled/
│   ├── view-models/        # Read models
│   │   └── auth.view-model.ts
│   ├── factories/          # Domain factories
│   │   ├── auth-aggregate.factory.ts
│   │   └── auth-view-model.factory.ts
│   ├── interfaces/         # Domain interfaces
│   │   ├── jwt-payload.interface.ts
│   │   └── token-pair.interface.ts
│   ├── enums/             # Domain enums
│   │   └── auth-provider.enum.ts
│   └── primitives/        # Domain primitives
│       └── auth.primitives.ts
├── infrastructure/         # Infrastructure layer
│   ├── auth/              # Auth infrastructure
│   │   └── jwt-auth.guard.ts
│   ├── database/          # Database repositories
│   │   ├── prisma/        # Write repository (Prisma/PostgreSQL - Master DB)
│   │   └── mongodb/       # Read repository (MongoDB)
│   ├── decorators/        # Decorators
│   │   ├── public/
│   │   ├── current-user/
│   │   ├── roles/
│   │   └── tenant-roles/
│   ├── guards/            # Guards
│   │   ├── owner/
│   │   ├── roles/
│   │   ├── tenant/
│   │   └── tenant-roles/
│   └── strategies/        # Passport strategies
│       └── jwt/
└── transport/             # Transport layer
    └── graphql/          # GraphQL resolvers and DTOs
        ├── resolvers/
        ├── dtos/
        └── mappers/
```

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

- **Commands**: Write operations (login, register) that modify state
- **Queries**: Read operations (findByCriteria) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Master database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `AuthCreatedEvent` - Published when an auth record is created
- `AuthLoggedInByEmailEvent` - Published when a user logs in
- `AuthRegisteredByEmailEvent` - Published when a user registers
- `AuthUpdatedEvent` - Published when auth is updated
- `AuthUpdatedLastLoginAtEvent` - Published when last login timestamp is updated

Events are handled asynchronously to update read models and trigger side effects.

#### Global Module

The Auth Module is marked as `@Global()`, which means:
- Guards and services are available throughout the application
- Other modules can use the guards without importing AuthModule
- JWT strategy and guards are automatically available

#### Multi-Tenant Architecture

- Auth records are stored in the master database (not tenant-specific)
- JWT tokens include `tenantIds` array for multi-tenant access
- TenantGuard validates tenant access using `x-tenant-id` header
- TenantRolesGuard validates tenant member roles

## Domain Model

### Auth Aggregate

The `AuthAggregate` is the main domain entity that encapsulates authentication business logic:

```typescript
class AuthAggregate {
  id: AuthUuidValueObject
  userId: UserUuidValueObject
  email: AuthEmailValueObject | null
  phoneNumber: AuthPhoneNumberValueObject | null
  emailVerified: AuthEmailVerifiedValueObject
  lastLoginAt: AuthLastLoginAtValueObject | null
  password: AuthPasswordValueObject | null
  provider: AuthProviderValueObject
  providerId: AuthProviderIdValueObject | null
  twoFactorEnabled: AuthTwoFactorEnabledValueObject
  createdAt: DateValueObject
  updatedAt: DateValueObject
}
```

**Methods:**
- `update(props, generateEvent)`: Updates auth properties
- `updateLastLoginAt(lastLoginAt, generateEvent)`: Updates last login timestamp
- `delete(generateEvent)`: Marks auth as deleted
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **AuthEmailValueObject**: Validates email format
- **AuthPasswordValueObject**: Validates password (hashed)
- **AuthProviderValueObject**: Validates authentication provider enum
- **AuthEmailVerifiedValueObject**: Boolean for email verification status
- **AuthLastLoginAtValueObject**: Timestamp for last login
- **AuthTwoFactorEnabledValueObject**: Boolean for 2FA status
- **AuthPhoneNumberValueObject**: Validates phone number
- **AuthProviderIdValueObject**: Provider-specific ID (e.g., Google ID)

### View Model

The `AuthViewModel` is optimized for read operations and stored in MongoDB for fast querying. View models are automatically synchronized via event handlers.

## Authentication Providers

The module supports multiple authentication providers:

### LOCAL

Local email/password authentication.

**Characteristics:**
- Email and password required
- Password is hashed using bcrypt
- Default provider for email registration

### GOOGLE

Google OAuth authentication.

**Characteristics:**
- Uses Google OAuth
- Provider ID is Google user ID
- Email may be provided by Google

### APPLE

Apple Sign-In authentication.

**Characteristics:**
- Uses Apple Sign-In
- Provider ID is Apple user ID
- Email may be provided by Apple

## Commands

Commands represent write operations that modify state:

### AuthRegisterByEmailCommand

Registers a new user with email and password.

**Handler:** `AuthRegisterByEmailCommandHandler`

**Process:**
1. Asserts email does not already exist
2. Creates a new user (via UserCreateCommand)
3. Hashes the password using bcrypt
4. Creates auth aggregate with LOCAL provider
5. Saves aggregate to write repository (Prisma - Master database)
6. Publishes `AuthCreatedEvent` and `AuthRegisteredByEmailEvent`
7. Returns auth ID

**Input:**
```typescript
{
  email: string  // Required, must be unique
  password: string  // Required, will be hashed
}
```

**Output:** `string` (auth ID)

**Business Rules:**
- Email must be unique
- Password is hashed using bcrypt
- User is automatically created
- Email is not verified by default
- Two-factor authentication is disabled by default

**Events Published:**
- `AuthCreatedEvent` - Published when auth is created
- `AuthRegisteredByEmailEvent` - Published when registration is complete

### AuthLoginByEmailCommand

Logs in a user with email and password.

**Handler:** `AuthLoginByEmailCommandHandler`

**Process:**
1. Asserts auth exists by email
2. Verifies password using bcrypt
3. Finds user by userId
4. Updates last login timestamp
5. Gets tenant members for the user
6. Generates JWT token pair (access + refresh)
7. Publishes `AuthLoggedInByEmailEvent`
8. Returns token pair

**Input:**
```typescript
{
  email: string  // Required
  password: string  // Required
}
```

**Output:** `ITokenPair` (accessToken and refreshToken)

**Business Rules:**
- Email must exist
- Password must match
- User must exist
- JWT tokens include user role and tenant IDs

**Events Published:**
- `AuthLoggedInByEmailEvent` - Published when login is successful
- `AuthUpdatedLastLoginAtEvent` - Published when last login is updated

## Queries

Queries represent read operations that don't modify state:

### FindAuthsByCriteriaQuery

Finds auth records by criteria with pagination. **Requires ADMIN role.**

**Handler:** `FindAuthsByCriteriaQueryHandler`

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

**Output:** `PaginatedResult<AuthViewModel>`

## Events

The module publishes domain events for important state changes:

### AuthCreatedEvent

Published when an auth record is created.

**Handler:** `AuthCreatedEventHandler`

**Process:**
1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

### AuthLoggedInByEmailEvent

Published when a user logs in successfully.

**Handler:** `AuthLoggedInByEmailEventHandler`

**Process:**
1. Updates view model with login information
2. Saves view model to read repository (MongoDB)

### AuthRegisteredByEmailEvent

Published when a user registers successfully.

**Handler:** `AuthRegisteredByEmailEventHandler`

**Process:**
1. Updates view model with registration information
2. Saves view model to read repository (MongoDB)

### AuthUpdatedEvent

Published when auth is updated.

**Handler:** `AuthUpdatedEventHandler`

**Process:**
1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

## JWT Authentication

The module provides comprehensive JWT authentication support.

### JWT Payload

The JWT payload includes:

```typescript
interface IJwtPayload {
  id: string;           // Auth ID
  userId: string;       // User ID
  email?: string;       // User email
  username?: string;    // Username
  role: string;         // User role (ADMIN, USER)
  tenantIds: string[];  // Array of tenant IDs the user belongs to
}
```

### Token Pair

The module generates a token pair:

```typescript
interface ITokenPair {
  accessToken: string;   // Short-lived access token (default: 15m)
  refreshToken: string;  // Long-lived refresh token (default: 7d)
}
```

### JWT Service

The `JwtAuthService` provides:

- `generateTokenPair(payload)`: Generates access and refresh tokens
- `verifyToken(token)`: Verifies and decodes a token
- `refreshToken(refreshToken)`: Generates new access token from refresh token

### JWT Strategy

The `JwtStrategy` (Passport strategy) validates JWT tokens:

1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies token signature and expiration
3. Loads auth aggregate from database
4. Attaches user data to request (role, userId, tenantIds)

### Environment Variables

```env
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

## Guards

The module provides comprehensive guards for access control:

### JwtAuthGuard

Validates JWT token and extracts user information.

**Usage:**
```typescript
@UseGuards(JwtAuthGuard)
```

**Features:**
- Validates JWT token from `Authorization` header
- Extracts user data from token
- Attaches user to request object
- Throws `UnauthorizedException` if token is invalid

### RolesGuard

Enforces role-based access control.

**Usage:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
```

**Features:**
- Validates user has required role
- Supports multiple roles (OR logic)
- Throws `ForbiddenException` if role doesn't match
- Admins bypass role checks

### OwnerGuard

Ensures users can only access their own resources.

**Usage:**
```typescript
@UseGuards(JwtAuthGuard, OwnerGuard)
```

**Features:**
- Validates resource ID matches authenticated user ID
- Admins can access any resource
- Throws `ForbiddenException` if user doesn't own resource
- Extracts resource ID from GraphQL args (`input.id`)

### TenantGuard

Validates tenant access using `x-tenant-id` header.

**Usage:**
```typescript
@UseGuards(JwtAuthGuard, TenantGuard)
```

**Features:**
- Validates `x-tenant-id` header is present
- Checks if tenant ID is in user's `tenantIds` array
- Admins can access any tenant
- Throws `ForbiddenException` if tenant access is denied
- **Required Header:** `x-tenant-id: <tenant-uuid>`

### TenantRolesGuard

Enforces tenant member role-based access control.

**Usage:**
```typescript
@UseGuards(JwtAuthGuard, TenantGuard, TenantRolesGuard)
@TenantRoles(TenantMemberRoleEnum.OWNER, TenantMemberRoleEnum.ADMIN)
```

**Features:**
- Requires `x-tenant-id` header
- Queries tenant member to get user's role in tenant
- Validates user has required tenant role
- Throws `ForbiddenException` if role doesn't match
- Supports multiple roles (OR logic)

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `AuthWriteRepository`

**Implementation:** `AuthPrismaRepository`

**Database:** PostgreSQL (Master database)

**Operations:**
- `findById(id: string): Promise<AuthAggregate | null>`
- `findByEmail(email: string): Promise<AuthAggregate | null>`
- `findByUserId(userId: string): Promise<AuthAggregate | null>`
- `save(auth: AuthAggregate): Promise<AuthAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Stores auth records in master database (not tenant-specific)
- Indexed on `email` for performance
- Soft delete support

### Read Repository (MongoDB)

**Interface:** `AuthReadRepository`

**Implementation:** `AuthMongoRepository`

**Database:** MongoDB

**Operations:**
- `findById(id: string): Promise<AuthViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<AuthViewModel>>`
- `save(authViewModel: AuthViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

**Public Endpoints:**
- `loginByEmail` - Public (no authentication required)
- `registerByEmail` - Public (no authentication required)

**Protected Endpoints:**
- `findAuthsByCriteria` - Requires ADMIN role

### AuthMutationsResolver

Handles write operations (mutations). **Marked as @Public()** - login and register don't require authentication.

**Mutations:**

#### loginByEmail

Logs in a user with email and password.

```graphql
mutation LoginByEmail($input: AuthLoginByEmailRequestDto!) {
  loginByEmail(input: $input) {
    accessToken
    refreshToken
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Response:**
```json
{
  "data": {
    "loginByEmail": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Process:**
1. Validates email and password
2. Verifies password using bcrypt
3. Updates last login timestamp
4. Generates JWT token pair
5. Returns tokens

#### registerByEmail

Registers a new user with email and password.

```graphql
mutation RegisterByEmail($input: AuthRegisterByEmailRequestDto!) {
  registerByEmail(input: $input) {
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
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Response:**
```json
{
  "data": {
    "registerByEmail": {
      "success": true,
      "message": "Auth registered successfully",
      "id": "auth-uuid"
    }
  }
}
```

**Process:**
1. Validates email is unique
2. Creates user
3. Hashes password
4. Creates auth record
5. Returns auth ID

### AuthQueryResolver

Handles read operations (queries). **Requires ADMIN role.**

**Queries:**

#### findAuthsByCriteria

Finds auth records by criteria with pagination.

```graphql
query FindAuthsByCriteria($input: AuthFindByCriteriaRequestDto) {
  findAuthsByCriteria(input: $input) {
    items {
      id
      email
      emailVerified
      provider
      lastLoginAt
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
        "field": "provider",
        "operator": "EQUALS",
        "value": "LOCAL"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

## Examples

### Complete Authentication Flow

```graphql
# 1. Register a new user
mutation {
  registerByEmail(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    success
    message
    id
  }
}

# 2. Login
mutation {
  loginByEmail(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    accessToken
    refreshToken
  }
}

# 3. Use access token in subsequent requests
# Header: Authorization: Bearer <accessToken>
# Header: x-tenant-id: <tenant-uuid> (if required)
```

### Using Guards in Other Modules

```typescript
// Require authentication
@UseGuards(JwtAuthGuard)
@Query(() => UserResponseDto)
async getUser() { ... }

// Require ADMIN role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Query(() => UsersResponseDto)
async getAllUsers() { ... }

// Require tenant context
@UseGuards(JwtAuthGuard, TenantGuard)
@Query(() => TenantDataResponseDto)
async getTenantData() { ... }

// Require tenant role
@UseGuards(JwtAuthGuard, TenantGuard, TenantRolesGuard)
@TenantRoles(TenantMemberRoleEnum.OWNER, TenantMemberRoleEnum.ADMIN)
@Mutation(() => MutationResponseDto)
async updateTenantSettings() { ... }

// Public endpoint (no authentication)
@Public()
@Query(() => PublicDataResponseDto)
async getPublicData() { ... }
```

## Troubleshooting

### Common Issues

1. **Invalid Credentials:**
   - Solution: Verify email and password are correct
   - Check if user exists
   - Verify password hash matches

2. **Email Already Exists:**
   - Solution: Email must be unique
   - Use a different email or login instead
   - Error: `AuthEmailAlreadyExistsException`

3. **JWT Token Invalid:**
   - Solution: Verify token is not expired
   - Check token signature matches secret
   - Ensure token is in `Authorization: Bearer <token>` format

4. **Tenant Access Denied:**
   - Solution: Ensure `x-tenant-id` header is present
   - Verify tenant ID is in user's `tenantIds` array
   - Check user is a member of the tenant
   - Error: `"Tenant ID is required. Please provide x-tenant-id header."`

5. **Insufficient Permissions:**
   - Solution: Check user has required role
   - Verify tenant member role if using TenantRolesGuard
   - Error: `"Insufficient permissions"` or `"Insufficient tenant permissions"`

6. **User Not Found:**
   - Solution: Verify auth record exists
   - Check if user was soft deleted
   - Error: `AuthNotFoundException`

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:
- Login/register operations
- JWT token generation and validation
- Guard execution
- Password hashing and verification
- Repository operations
- Event handling

## Database Schema

### Prisma Schema (Master Database)

```prisma
enum AuthProviderEnum {
  LOCAL
  GOOGLE
  APPLE
}

model Auth {
  id               String           @id @default(uuid())
  provider         AuthProviderEnum
  providerId       String?
  email            String?          @unique
  phoneNumber      String?
  password         String?
  emailVerified    Boolean          @default(false)
  twoFactorEnabled Boolean          @default(false)
  lastLoginAt      DateTime?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  userId String
  user   User   @relation(fields: [userId], references: [id])

  @@index([email])
  @@index([userId])
}
```

**Note:** Auth records are stored in the master database, not in tenant-specific databases. This allows for:
- Centralized authentication
- Cross-tenant user management
- Efficient auth lookup
- Simplified authentication flow

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure as the Prisma model, optimized for read operations.

## Best Practices

1. **Password Security** - Always hash passwords using bcrypt before storing
2. **Token Expiration** - Use short-lived access tokens (15m) and long-lived refresh tokens (7d)
3. **Token Storage** - Store tokens securely (httpOnly cookies or secure storage)
4. **Tenant Context** - Always include `x-tenant-id` header for tenant-specific operations
5. **Role Management** - Use appropriate guards for different access levels
6. **Public Endpoints** - Mark public endpoints with `@Public()` decorator
7. **Error Handling** - Provide clear error messages without exposing sensitive information

## Integration with Other Modules

### User Context

- Creates user automatically during registration
- Links auth to user via `userId`
- Uses user role in JWT payload

### Tenant Members Module

- Queries tenant members to get user's tenant IDs
- Includes tenant IDs in JWT payload
- Validates tenant membership for access control

### Other Modules

- Guards are exported globally and can be used in any module
- JWT strategy is available application-wide
- Services can be injected where needed

## Environment Variables

```env
# JWT Configuration
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Password Hashing
BCRYPT_SALT_ROUNDS=10
```

## License

This module is part of the SaaS Boilerplate project.

