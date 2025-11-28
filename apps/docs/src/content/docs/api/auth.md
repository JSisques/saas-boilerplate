---
title: Auth
description: Complete guide to authentication and authorization
---

The **Auth** module provides comprehensive authentication and authorization capabilities for a multi-tenant SaaS application. It handles user registration, login, JWT token generation, password hashing, and provides guards for role-based and tenant-based access control.

> **Important:** The Auth module is a **Global Module**, meaning its guards and services are available throughout the application. Login and register endpoints are public (no authentication required), but most other operations require JWT authentication.

## Overview

The Auth Module manages:

- ✅ User registration by email
- ✅ User login with JWT token generation
- ✅ Password hashing and verification (bcrypt)
- ✅ Multiple authentication providers (LOCAL, GOOGLE, APPLE)
- ✅ JWT access and refresh tokens
- ✅ Comprehensive guards for access control
- ✅ Tenant-based authorization
- ✅ Role-based authorization

## Authentication Flow

### Registration

1. User provides email and password
2. System validates email is unique
3. System creates user automatically
4. System hashes password using bcrypt
5. System creates auth record with LOCAL provider
6. Returns auth ID

### Login

1. User provides email and password
2. System finds auth by email
3. System verifies password using bcrypt
4. System finds user and tenant members
5. System generates JWT token pair (access + refresh)
6. System updates last login timestamp
7. Returns tokens

### Using Tokens

1. Client includes access token in `Authorization: Bearer <token>` header
2. JwtAuthGuard validates token
3. JwtStrategy loads user data and attaches to request
4. Other guards (RolesGuard, TenantGuard, etc.) validate access

## GraphQL API

### Public Mutations

#### loginByEmail

Logs in a user with email and password. **Public endpoint - no authentication required.**

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
4. Generates JWT token pair with user role and tenant IDs
5. Returns tokens

#### registerByEmail

Registers a new user with email and password. **Public endpoint - no authentication required.**

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
2. Creates user automatically
3. Hashes password using bcrypt
4. Creates auth record with LOCAL provider
5. Returns auth ID

### Protected Queries

#### findAuthsByCriteria

Finds auth records by criteria with pagination. **Requires ADMIN role.**

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

**Required Headers:**
```http
Authorization: Bearer <access-token>
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

## JWT Authentication

### JWT Payload

The JWT payload includes:

```typescript
{
  id: string;           // Auth ID
  userId: string;       // User ID
  email?: string;       // User email
  username?: string;    // Username
  role: string;         // User role (ADMIN, USER)
  tenantIds: string[];  // Array of tenant IDs the user belongs to
}
```

### Token Pair

The module generates two tokens:

- **Access Token**: Short-lived (default: 15 minutes)
  - Used for API requests
  - Includes user role and tenant IDs
  - Must be included in `Authorization: Bearer <token>` header

- **Refresh Token**: Long-lived (default: 7 days)
  - Used to generate new access tokens
  - Should be stored securely

### Using Access Token

```http
Authorization: Bearer <access-token>
x-tenant-id: <tenant-uuid>  # Required for tenant-specific operations
```

## Guards

The Auth module provides comprehensive guards for access control. These guards are exported globally and can be used in any module.

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

Enforces role-based access control based on user roles.

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

**Example:**
```typescript
@Query(() => UsersResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
async getAllUsers() {
  // Only ADMIN can access this
}
```

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

**Example:**
```typescript
@Mutation(() => MutationResponseDto)
@UseGuards(JwtAuthGuard, OwnerGuard)
async updateUser(@Args('input') input: UpdateUserRequestDto) {
  // Users can only update their own profile
  // Admins can update any user
}
```

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

**Example:**
```typescript
@Query(() => TenantDataResponseDto)
@UseGuards(JwtAuthGuard, TenantGuard)
async getTenantData() {
  // Requires x-tenant-id header
  // Validates user has access to the tenant
}
```

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

**Example:**
```typescript
@Mutation(() => MutationResponseDto)
@UseGuards(JwtAuthGuard, TenantGuard, TenantRolesGuard)
@TenantRoles(TenantMemberRoleEnum.OWNER, TenantMemberRoleEnum.ADMIN)
async updateTenantSettings() {
  // Requires x-tenant-id header
  // Validates user is OWNER or ADMIN in the tenant
}
```

### Public Decorator

Marks endpoints as public (bypasses authentication).

**Usage:**
```typescript
@Public()
@Query(() => PublicDataResponseDto)
async getPublicData() {
  // No authentication required
}
```

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

## Complete Authentication Flow

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

## Using Guards in Other Modules

The Auth module is global, so guards can be used anywhere:

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

Auth records are stored in the master database:

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

**Note:** Storing auth records in the master database allows for:
- Centralized authentication
- Cross-tenant user management
- Efficient auth lookup
- Simplified authentication flow

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure, optimized for read operations.

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

