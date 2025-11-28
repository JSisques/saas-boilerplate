# Storage Module

A comprehensive file storage module that supports multiple storage providers (AWS S3, Supabase, and custom server routes) with GraphQL API integration. The module follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Storage Providers](#storage-providers)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Environment Variables](#environment-variables)
- [File Upload Guide](#file-upload-guide)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Storage Module provides a flexible file storage solution with support for multiple storage providers. It implements a multi-tenant architecture with separate write and read databases, following the CQRS pattern for optimal performance and scalability.

### Features

- ✅ Multiple storage providers (S3, Supabase, Server Route)
- ✅ GraphQL API for file operations
- ✅ File upload with multipart/form-data support
- ✅ File download and deletion
- ✅ Event-driven architecture
- ✅ Lazy initialization of storage providers
- ✅ Automatic provider selection based on configuration
- ✅ Multi-tenant support with tenant isolation
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates
- ✅ View models for optimized read operations

## Architecture

The module is organized following Clean Architecture principles with clear separation of concerns:

```
storage/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── storage-upload-file/
│   │   ├── storage-delete-file/
│   │   └── storage-download-file/
│   ├── queries/             # Query handlers
│   │   ├── storage-find-by-id/
│   │   ├── storage-find-by-criteria/
│   │   └── storage-view-model-find-by-id/
│   ├── event-handlers/      # Event handlers
│   │   ├── storage-uploaded/
│   │   └── storage-file-deleted/
│   ├── services/           # Application services
│   │   ├── assert-storage-exsits/
│   │   └── assert-storage-view-model-exsits/
│   └── exceptions/         # Application exceptions
│       └── storage-not-found/
├── domain/                  # Domain layer
│   ├── aggregate/          # Storage aggregate
│   │   └── storage.aggregate.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── storage-write.repository.ts
│   │   └── storage-read.repository.ts
│   ├── value-objects/      # Value objects
│   │   ├── storage-file-name/
│   │   ├── storage-file-size/
│   │   ├── storage-mime-type/
│   │   ├── storage-path/
│   │   ├── storage-provider/
│   │   └── storage-url/
│   ├── view-models/        # Read models
│   │   └── storage.view-model.ts
│   ├── factories/          # Domain factories
│   │   ├── storage-aggregate.factory.ts
│   │   └── storage-view-model.factory.ts
│   ├── enums/             # Domain enums
│   │   └── storage-provider.enum.ts
│   ├── primitives/        # Domain primitives
│   │   └── storage.primitives.ts
│   └── dtos/              # Domain DTOs
│       ├── entities/
│       └── view-models/
├── infrastructure/         # Infrastructure layer
│   ├── database/          # Database repositories
│   │   ├── prisma/        # Write repository (Prisma/PostgreSQL)
│   │   └── mongodb/       # Read repository (MongoDB)
│   ├── storage-providers/ # Storage provider implementations
│   │   ├── s3/
│   │   ├── supabase/
│   │   ├── server-route/
│   │   ├── storage-provider.interface.ts
│   │   └── storage-provider-factory.service.ts
│   └── exceptions/        # Infrastructure exceptions
│       ├── s3/
│       ├── supabase/
│       └── server-route/
└── transport/             # Transport layer
    └── graphql/          # GraphQL resolvers and DTOs
        ├── resolvers/
        ├── dtos/
        └── mappers/
```

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

- **Commands**: Write operations (upload, delete, download) that modify state
- **Queries**: Read operations (findById, findByCriteria) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `StorageCreatedEvent`: Published when a storage aggregate is created
- `StorageFileUploadedEvent`: Published when a file is successfully uploaded
- `StorageFileDownloadedEvent`: Published when a file is downloaded
- `StorageFileDeletedEvent`: Published when a file is deleted
- `StorageUpdatedEvent`: Published when storage metadata is updated

Events are handled asynchronously to update read models and trigger side effects.

#### Multi-Tenant Architecture

- Each tenant has isolated storage records
- Tenant context is automatically injected via `TenantContextService`
- Write operations use tenant-specific Prisma clients
- Read operations use tenant-specific MongoDB databases

## Domain Model

### Storage Aggregate

The `StorageAggregate` is the main domain entity that encapsulates storage business logic:

```typescript
class StorageAggregate {
  id: StorageUuidValueObject
  fileName: StorageFileNameValueObject
  fileSize: StorageFileSizeValueObject
  mimeType: StorageMimeTypeValueObject
  provider: StorageProviderValueObject
  url: StorageUrlValueObject
  path: StoragePathValueObject
  createdAt: DateValueObject
  updatedAt: DateValueObject
}
```

**Methods:**
- `update(props, generateEvent)`: Updates storage metadata
- `delete(generateEvent)`: Marks storage as deleted
- `markAsDownloaded(generateEvent)`: Records file download
- `markAsUploaded(generateEvent)`: Records file upload
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **StorageFileNameValueObject**: Validates file name (min length: 1, trimmed)
- **StorageFileSizeValueObject**: Represents file size in bytes
- **StorageMimeTypeValueObject**: Validates MIME type
- **StoragePathValueObject**: Represents file path in storage
- **StorageProviderValueObject**: Validates storage provider enum
- **StorageUrlValueObject**: Represents file URL

### View Model

The `StorageViewModel` is optimized for read operations:

```typescript
class StorageViewModel {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  provider: string
  url: string
  path: string
  createdAt: Date
  updatedAt: Date
}
```

View models are stored in MongoDB for fast querying and are automatically synchronized via event handlers.

## Storage Providers

The module supports three storage providers through a common interface (`IStorageProvider`):

### Interface

All storage providers implement:

```typescript
interface IStorageProvider {
  upload(file: Buffer, path: string, mimeType: string): Promise<string>
  download(path: string): Promise<Buffer>
  delete(path: string): Promise<boolean>
  getUrl(path: string): Promise<string>
  getProviderType(): StorageProviderEnum
}
```

### 1. AWS S3

Stores files in Amazon S3 buckets with presigned URLs for secure access.

**Features:**
- Presigned URLs (1 hour expiration)
- Support for all S3-compatible services (MinIO, DigitalOcean Spaces, etc.)
- Configurable region
- Lazy client initialization
- Automatic error handling with custom exceptions

**Configuration:**
```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=us-east-1  # Optional, defaults to us-east-1
```

**Implementation Details:**
- Uses `@aws-sdk/client-s3` for S3 operations
- Uses `@aws-sdk/s3-request-presigner` for presigned URLs
- Client is initialized lazily on first use
- Throws `S3UploadFailedException`, `S3DownloadFailedException`, `S3DeleteFailedException` on errors

### 2. Supabase Storage

Stores files in Supabase Storage buckets with public URLs.

**Features:**
- Public URL generation
- Bucket-based organization
- Simple configuration
- Automatic path extraction from URLs
- Upsert support (overwrites existing files)

**Configuration:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=files  # Optional, defaults to 'files'
```

**Implementation Details:**
- Uses `@supabase/supabase-js` for Supabase operations
- Client is initialized lazily on first use
- Automatically extracts relative paths from full URLs
- Throws `SupabaseUploadFailedException`, `SupabaseDownloadFailedException`, `SupabaseDeleteFailedException`, `SupabaseFileNotFoundException` on errors

### 3. Server Route

Custom HTTP-based storage provider for custom storage solutions.

**Features:**
- RESTful API integration
- Bearer token authentication
- Flexible endpoint configuration
- Supports custom storage backends

**Configuration:**
```env
STORAGE_SERVER_ROUTE_URL=https://your-storage-server.com
STORAGE_SERVER_ROUTE_API_KEY=your_api_key
```

**API Endpoints Expected:**
- `POST /upload` - Upload file (multipart/form-data)
- `GET /download/:path` - Download file
- `DELETE /delete/:path` - Delete file
- `GET /files/:path` - Get file URL

**Implementation Details:**
- Uses `@nestjs/axios` for HTTP requests
- Requires Bearer token authentication
- Throws `ServerRouteUploadFailedException`, `ServerRouteDownloadFailedException`, `ServerRouteDeleteFailedException` on errors

### Storage Provider Factory

The `StorageProviderFactoryService` manages provider selection:

```typescript
class StorageProviderFactoryService {
  getProvider(provider: StorageProviderEnum): IStorageProvider
  getDefaultProvider(): IStorageProvider
  getProviderType(provider: IStorageProvider): StorageProviderEnum
}
```

Providers are lazily initialized to avoid startup errors when configuration is missing.

## Commands

Commands represent write operations that modify state:

### StorageUploadFileCommand

Uploads a file to the configured storage provider.

**Handler:** `StorageUploadFileCommandHandler`

**Process:**
1. Gets the default storage provider from factory
2. Uploads file to storage provider
3. Creates storage aggregate with file metadata
4. Saves aggregate to write repository (Prisma)
5. Marks as uploaded and publishes `StorageFileUploadedEvent`
6. Returns storage ID

**Input:**
```typescript
{
  buffer: Buffer
  fileName: string
  mimetype: string
  size: number
}
```

**Output:** `string` (storage ID)

### StorageDeleteFileCommand

Deletes a file from storage and removes the record.

**Handler:** `StorageDeleteFileCommandHandler`

**Process:**
1. Asserts storage exists
2. Gets storage provider based on stored provider type
3. Deletes file from storage provider
4. Deletes record from write repository
5. Publishes `StorageFileDeletedEvent`
6. Returns success boolean

**Input:**
```typescript
{
  id: string
}
```

**Output:** `boolean`

### StorageDownloadFileCommand

Downloads a file from storage.

**Handler:** `StorageDownloadFileCommandHandler`

**Process:**
1. Finds storage aggregate by ID
2. Gets storage provider based on stored provider type
3. Downloads file from storage provider
4. Marks as downloaded and publishes `StorageFileDownloadedEvent`
5. Returns file buffer

**Input:**
```typescript
{
  id: string
}
```

**Output:** `Buffer`

## Queries

Queries represent read operations that don't modify state:

### StorageFindByIdQuery

Finds a storage aggregate by ID.

**Handler:** `StorageFindByIdQueryHandler`

**Process:**
1. Asserts storage exists using `AssertStorageExsistsService`
2. Returns storage aggregate

**Input:**
```typescript
{
  id: string
}
```

**Output:** `StorageAggregate`

### StorageFindByCriteriaQuery

Finds storages by criteria with pagination.

**Handler:** `StorageFindByCriteriaQueryHandler`

**Process:**
1. Builds MongoDB query from criteria
2. Executes query with pagination
3. Returns paginated result with view models

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

**Output:** `PaginatedResult<StorageViewModel>`

### StorageViewModelFindByIdQuery

Finds a storage view model by ID (optimized for read operations).

**Handler:** `StorageViewModelFindByIdQueryHandler`

**Process:**
1. Asserts view model exists using `AssertStorageViewModelExsistsService`
2. Returns storage view model

**Input:**
```typescript
{
  id: string
}
```

**Output:** `StorageViewModel`

## Events

The module publishes domain events for important state changes:

### StorageFileUploadedEvent

Published when a file is successfully uploaded.

**Handler:** `StorageUploadedEventHandler`

**Process:**
1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

This ensures read models are synchronized with write models.

### StorageFileDeletedEvent

Published when a file is deleted.

**Handler:** `StorageFileDeletedEventHandler`

**Process:**
1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

This ensures read models are cleaned up when files are deleted.

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `StorageWriteRepository`

**Implementation:** `StoragePrismaRepository`

**Database:** PostgreSQL (tenant-specific)

**Operations:**
- `findById(id: string): Promise<StorageAggregate | null>`
- `findByPath(path: string): Promise<StorageAggregate | null>`
- `save(storage: StorageAggregate): Promise<StorageAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Tenant-aware (uses `BasePrismaTenantRepository`)
- Request-scoped for tenant context
- Uses Prisma mapper for domain/DB conversion
- Indexed on `path` and `provider` for performance

### Read Repository (MongoDB)

**Interface:** `StorageReadRepository`

**Implementation:** `StorageMongoRepository`

**Database:** MongoDB (tenant-specific)

**Operations:**
- `findById(id: string): Promise<StorageViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<StorageViewModel>>`
- `save(storageViewModel: StorageViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Tenant-aware (uses `BaseMongoTenantRepository`)
- Request-scoped for tenant context
- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination
- Collection name: `storages`

## Authentication & Authorization

All storage operations require authentication and tenant context. The module uses multiple guards to ensure security and proper tenant isolation.

### Required Headers

Every request to the storage API must include:

1. **Authorization Header** - JWT token for authentication
   ```http
   Authorization: Bearer <jwt-token>
   ```

2. **Tenant ID Header** - Tenant context for multi-tenant isolation
   ```http
   x-tenant-id: <tenant-uuid>
   ```
   or
   ```http
   X-Tenant-Id: <tenant-uuid>
   ```

### Guards

The module applies the following guards to all endpoints:

1. **JwtAuthGuard** - Validates JWT token and extracts user information
2. **TenantGuard** - Validates tenant context and ensures user has access to the tenant
3. **RolesGuard** - Validates user has ADMIN or USER role
4. **TenantRolesGuard** - Validates user has appropriate tenant member role (OWNER, ADMIN, or MEMBER)

### Tenant Context Validation

- The `x-tenant-id` header is **required** for all operations
- The tenant ID must match one of the tenant IDs in the user's JWT token (`tenantIds` array)
- Users with ADMIN role can access any tenant
- Regular users can only access tenants they are members of
- If the tenant ID is missing or invalid, the request will be rejected with a `ForbiddenException`

### Example Request

```bash
curl -X POST http://localhost:4100/api/graphql \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "x-tenant-id: 123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { storageFindById(input: { id: \"...\" }) { id fileName } }"
  }'
```

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

All storage operations require:

1. **JWT Authentication** - Valid JWT token in `Authorization` header
2. **Tenant Context** - Tenant ID in `x-tenant-id` or `X-Tenant-Id` header
3. **User Role** - User must have ADMIN or USER role
4. **Tenant Role** - User must be a member of the tenant with appropriate role

**Required Headers:**

```http
Authorization: Bearer <jwt-token>
x-tenant-id: <tenant-uuid>
```

**Example Request:**

```bash
curl -X POST http://localhost:4100/api/graphql \
  -H "Authorization: Bearer your-jwt-token" \
  -H "x-tenant-id: tenant-uuid-here" \
  -H "Content-Type: application/json" \
  -d '{"query": "..."}'
```

**Important Notes:**

- The `x-tenant-id` header is **required** for all operations
- The tenant ID must match one of the tenant IDs in the user's JWT token
- Users with ADMIN role can access any tenant
- Regular users can only access tenants they are members of
- The tenant context is automatically extracted and used for data isolation

### StorageQueryResolver

Handles read operations (queries).

**Guards:**
- `JwtAuthGuard`: Requires authentication
- `TenantGuard`: Requires tenant context (validates `x-tenant-id` header)
- `RolesGuard`: Requires user role (ADMIN or USER)
- `TenantRolesGuard`: Requires tenant member role

**Queries:**

#### storageFindById

Finds a storage by ID.

```graphql
query FindStorageById($input: StorageFindByIdRequestDto!) {
  storageFindById(input: $input) {
    id
    fileName
    fileSize
    mimeType
    provider
    url
    path
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "uuid-here"
  }
}
```

#### storageFindByCriteria

Finds storages by criteria with pagination.

```graphql
query FindStoragesByCriteria($input: StorageFindByCriteriaRequestDto) {
  storageFindByCriteria(input: $input) {
    items {
      id
      fileName
      fileSize
      mimeType
      provider
      url
      path
      createdAt
      updatedAt
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
    "filters": [],
    "sorts": [],
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

### StorageMutationsResolver

Handles write operations (mutations).

**Guards:**
- `JwtAuthGuard`: Requires authentication
- `TenantGuard`: Requires tenant context
- `RolesGuard`: Requires user role (ADMIN or USER)
- `TenantRolesGuard`: Requires tenant member role (OWNER, ADMIN, or MEMBER)

**Mutations:**

#### storageUploadFile

Uploads a file to storage.

```graphql
mutation StorageUploadFile($file: Upload!) {
  storageUploadFile(file: $file) {
    success
    message
    id
  }
}
```

**Response:**
```json
{
  "data": {
    "storageUploadFile": {
      "success": true,
      "message": "File uploaded successfully",
      "id": "uuid-of-uploaded-file"
    }
  }
}
```

#### storageDownloadFiles

Downloads multiple files by IDs.

```graphql
mutation StorageDownloadFiles($input: StorageDownloadFileRequestDto!) {
  storageDownloadFiles(input: $input) {
    content
    fileName
    mimeType
    fileSize
  }
}
```

**Variables:**
```json
{
  "input": {
    "ids": ["uuid-1", "uuid-2"]
  }
}
```

**Response:**
```json
{
  "data": {
    "storageDownloadFiles": [
      {
        "content": "base64-encoded-file-content",
        "fileName": "example.pdf",
        "mimeType": "application/pdf",
        "fileSize": 1024
      }
    ]
  }
}
```

#### storageDeleteFile

Deletes one or more files.

```graphql
mutation StorageDeleteFile($input: StorageDeleteFileRequestDto!) {
  storageDeleteFile(input: $input) {
    success
    message
    ids
  }
}
```

**Variables:**
```json
{
  "input": {
    "ids": ["uuid-1", "uuid-2"]
  }
}
```

**Response:**
```json
{
  "data": {
    "storageDeleteFile": {
      "success": true,
      "message": "Files deleted successfully",
      "ids": ["uuid-1", "uuid-2"]
    }
  }
}
```

## Environment Variables

### Required Variables

#### Storage Provider Selection

```env
# Options: S3, SUPABASE, SERVER_ROUTE
# Default: S3
STORAGE_PROVIDER=S3
```

### AWS S3 Configuration

Required when `STORAGE_PROVIDER=S3`:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=us-east-1  # Optional, defaults to us-east-1
```

### Supabase Configuration

Required when `STORAGE_PROVIDER=SUPABASE`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=files  # Optional, defaults to 'files'
```

### Server Route Configuration

Required when `STORAGE_PROVIDER=SERVER_ROUTE`:

```env
STORAGE_SERVER_ROUTE_URL=https://your-storage-server.com
STORAGE_SERVER_ROUTE_API_KEY=your_api_key
```

### Notes

- Only configure variables for the provider you're using
- Providers are lazily initialized, so missing configuration won't cause startup errors
- The configured provider is logged when the module initializes
- All providers support tenant isolation automatically

## File Upload Guide

File uploads use the GraphQL multipart request specification. The module requires the `graphql-upload` middleware to be configured.

### Configuration

The upload middleware should be configured in `main.ts`:

```typescript
app.use(
  '/graphql',
  graphqlUploadExpress({
    maxFileSize: 10000000, // 10MB
    maxFiles: 10,
  }),
);
```

### Using Postman

1. **Method:** `POST`
2. **URL:** `http://localhost:4100/api/graphql`
3. **Headers:**
   - `Authorization: Bearer <your-jwt-token>` (required for authentication)
   - `x-tenant-id: <tenant-uuid>` (required for tenant context)
   - `apollo-require-preflight: true` (required for CSRF protection)

4. **Body:** Select `form-data` and add three fields:

   **Field 1: `operations`** (Type: Text)

   ```json
   {
     "query": "mutation StorageUploadFile($file: Upload!) { storageUploadFile(file: $file) { success message id } }",
     "variables": { "file": null }
   }
   ```

   **Field 2: `map`** (Type: Text)

   ```json
   { "0": ["variables.file"] }
   ```

   **Field 3: `0`** (Type: File)
   - Select your file here

### Using cURL

```bash
curl -X POST http://localhost:4100/api/graphql \
  -H "Authorization: Bearer your-jwt-token" \
  -H "x-tenant-id: tenant-uuid-here" \
  -H "apollo-require-preflight: true" \
  -F 'operations={"query":"mutation StorageUploadFile($file: Upload!) { storageUploadFile(file: $file) { success message id } }","variables":{"file":null}}' \
  -F 'map={"0":["variables.file"]}' \
  -F '0=@path/to/your/file.txt'
```

### Using JavaScript/TypeScript (fetch)

```javascript
const file = document.querySelector('input[type="file"]').files[0];

const formData = new FormData();
formData.append(
  'operations',
  JSON.stringify({
    query: `
      mutation StorageUploadFile($file: Upload!) {
        storageUploadFile(file: $file) {
          success
          message
          id
        }
      }
    `,
    variables: {
      file: null,
    },
  }),
);

formData.append('map', JSON.stringify({ 0: ['variables.file'] }));
formData.append('0', file);

const response = await fetch('http://localhost:4100/api/graphql', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${yourJwtToken}`,
    'x-tenant-id': tenantUuid,
    'apollo-require-preflight': 'true',
  },
  body: formData,
});

const result = await response.json();
console.log(result);
```

### Using Apollo Client

First, install the required package:

```bash
npm install apollo-upload-client
```

Then configure Apollo Client:

```typescript
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: 'http://localhost:4100/api/graphql',
    headers: {
      'Authorization': `Bearer ${yourJwtToken}`,
      'x-tenant-id': tenantUuid,
      'apollo-require-preflight': 'true',
    },
  }),
});

// Usage
const file = event.target.files[0];

const { data } = await client.mutate({
  mutation: gql`
    mutation StorageUploadFile($file: Upload!) {
      storageUploadFile(file: $file) {
        success
        message
        id
      }
    }
  `,
  variables: {
    file,
  },
});
```

## Examples

### Complete Upload Flow

1. **Upload a file:**
   ```graphql
   mutation {
     storageUploadFile(file: $file) {
       success
       message
       id
     }
   }
   ```

2. **Get file information:**
   ```graphql
   query {
     storageFindById(input: { id: "file-id-from-upload" }) {
       id
       fileName
       fileSize
       mimeType
       url
     }
   }
   ```

3. **Download file:**
   ```graphql
   mutation {
     storageDownloadFiles(input: { ids: ["file-id"] }) {
       content
       fileName
       mimeType
       fileSize
     }
   }
   ```

4. **Delete a file:**
   ```graphql
   mutation {
     storageDeleteFile(input: { ids: ["file-id"] }) {
       success
       message
     }
   }
   ```

### Query with Filters

```graphql
query {
  storageFindByCriteria(input: {
    filters: [
      {
        field: "provider"
        operator: "eq"
        value: "S3"
      },
      {
        field: "fileSize"
        operator: "gt"
        value: 1000
      }
    ]
    sorts: [
      {
        field: "createdAt"
        direction: "desc"
      }
    ]
    pagination: {
      page: 1
      limit: 20
    }
  }) {
    items {
      id
      fileName
      fileSize
      provider
    }
    total
    page
    limit
  }
}
```

### Error Handling

The module provides detailed error messages:

- **Missing configuration:** Clear error messages indicating which environment variables are required
- **Upload failures:** Provider-specific error messages
- **File not found:** Appropriate error responses for missing files
- **Storage not found:** `StorageNotFoundException` when storage doesn't exist

## Module Initialization

When the module initializes, it logs the configured storage provider:

```
📦 Storage Provider: S3
```

This helps verify that the correct provider is being used.

### Architecture Notes

#### Lazy Initialization

Storage providers are lazily initialized to avoid startup errors when configuration is missing. Each provider only initializes its client when actually used.

#### Event-Driven

File uploads and deletions trigger events that are handled asynchronously:

- `StorageFileUploadedEvent` - Published after successful file upload, handled by `StorageUploadedEventHandler` to update read model
- `StorageFileDeletedEvent` - Published after successful file deletion, handled by `StorageFileDeletedEventHandler` to clean up read model

#### CQRS Pattern

The module follows CQRS:

- **Commands:** Upload, Delete, Download (write operations)
- **Queries:** Find by ID, Find by Criteria (read operations)
- **Events:** File uploaded, File deleted (asynchronous side effects)

#### Repository Pattern

Two repositories are used:

- **Write Repository (Prisma):** For write operations and aggregate persistence (PostgreSQL)
- **Read Repository (MongoDB):** For read operations and view models (MongoDB)

#### Multi-Tenant Support

- All operations are tenant-aware
- Tenant context is automatically injected via `TenantContextService`
- Each tenant has isolated storage records
- Write and read databases are tenant-specific
- **Tenant ID must be provided in every request** via `x-tenant-id` or `X-Tenant-Id` header
- The tenant ID is validated against the user's JWT token to ensure proper access control

## Troubleshooting

### Common Issues

1. **CSRF Error:**
   - Solution: Add `apollo-require-preflight: true` header

2. **"POST body missing" Error:**
   - Solution: Ensure `graphqlUploadExpress` middleware is configured in `main.ts`

3. **"Variable $file is not defined" Error:**
   - Solution: Include `($file: Upload!)` in the mutation signature

4. **Provider Initialization Error:**
   - Solution: Check that all required environment variables for the selected provider are set

5. **Storage Not Found Error:**
   - Solution: Verify the storage ID exists and belongs to the current tenant

6. **Tenant Context Missing:**
   - Solution: Ensure `TenantGuard` is applied and tenant context is set in request headers
   - **Required Header:** `x-tenant-id: <tenant-uuid>`
   - The tenant ID must be included in every request
   - The tenant ID must match one of the tenant IDs in the user's JWT token

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:
- Provider initialization
- File upload/download/delete operations
- Repository operations
- Event handling

## Database Schema

### Prisma Schema (Write Database)

```prisma
enum StorageProviderEnum {
  S3
  SUPABASE
  SERVER_ROUTE
}

model Storage {
  id       String              @id @default(uuid())
  fileName String
  fileSize Int
  mimeType String
  provider StorageProviderEnum
  url      String
  path     String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([path])
  @@index([provider])
}
```

### MongoDB Schema (Read Database)

The MongoDB collection `storages` stores view models with the same structure as the Prisma model, optimized for read operations.

## License

This module is part of the SaaS Boilerplate project.
