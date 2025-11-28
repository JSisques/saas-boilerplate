---
title: Storage
description: Complete guide to file storage operations with multiple provider support
---

The **Storage** module provides a comprehensive file storage solution with support for multiple storage providers (AWS S3, Supabase, and custom server routes). It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design with multi-tenant support.

## Overview

The Storage Module provides a flexible file storage solution that supports:

> **Important:** All storage operations require authentication and tenant context. You must include a valid JWT token in the `Authorization` header and the tenant ID in the `x-tenant-id` header for every request.

- ✅ Multiple storage providers (S3, Supabase, Server Route)
- ✅ GraphQL API for file operations
- ✅ File upload with multipart/form-data support
- ✅ File download and deletion
- ✅ Event-driven architecture
- ✅ Lazy initialization of storage providers
- ✅ Automatic provider selection based on configuration
- ✅ Multi-tenant support with tenant isolation
- ✅ CQRS pattern with separate read/write repositories

## Architecture

The module follows Clean Architecture with clear separation of concerns:

- **Application Layer**: Command handlers, query handlers, and event handlers
- **Domain Layer**: Aggregates, value objects, repositories interfaces, and domain events
- **Infrastructure Layer**: Database repositories (Prisma for writes, MongoDB for reads) and storage provider implementations
- **Transport Layer**: GraphQL resolvers and DTOs

### CQRS Pattern

- **Commands**: Write operations (upload, delete, download) that modify state
- **Queries**: Read operations (findById, findByCriteria) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

### Event-Driven Architecture

The module publishes domain events for important state changes:

- `StorageCreatedEvent` - Published when a storage aggregate is created
- `StorageFileUploadedEvent` - Published when a file is successfully uploaded
- `StorageFileDownloadedEvent` - Published when a file is downloaded
- `StorageFileDeletedEvent` - Published when a file is deleted
- `StorageUpdatedEvent` - Published when storage metadata is updated

## Storage Providers

The module supports three storage providers through a common interface:

### AWS S3

Stores files in Amazon S3 buckets with presigned URLs for secure access.

**Features:**
- Presigned URLs (1 hour expiration)
- Support for all S3-compatible services (MinIO, DigitalOcean Spaces, etc.)
- Configurable region
- Lazy client initialization

**Required Environment Variables:**
```env
STORAGE_PROVIDER=S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=us-east-1  # Optional, defaults to us-east-1
```

### Supabase Storage

Stores files in Supabase Storage buckets with public URLs.

**Features:**
- Public URL generation
- Bucket-based organization
- Simple configuration
- Automatic path extraction from URLs

**Required Environment Variables:**
```env
STORAGE_PROVIDER=SUPABASE
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=files  # Optional, defaults to 'files'
```

### Server Route

Custom HTTP-based storage provider for custom storage solutions.

**Features:**
- RESTful API integration
- Bearer token authentication
- Flexible endpoint configuration

**Required Environment Variables:**
```env
STORAGE_PROVIDER=SERVER_ROUTE
STORAGE_SERVER_ROUTE_URL=https://your-storage-server.com
STORAGE_SERVER_ROUTE_API_KEY=your_api_key
```

**Expected API Endpoints:**
- `POST /upload` - Upload file (multipart/form-data)
- `GET /download/:path` - Download file
- `DELETE /delete/:path` - Delete file
- `GET /files/:path` - Get file URL

## GraphQL API

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

### Queries

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

**Response:**
```json
{
  "data": {
    "storageFindById": {
      "id": "uuid",
      "fileName": "example.pdf",
      "fileSize": 1024,
      "mimeType": "application/pdf",
      "provider": "S3",
      "url": "https://...",
      "path": "example.pdf",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
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
    "filters": [
      {
        "field": "provider",
        "operator": "EQUALS",
        "value": "S3"
      },
      {
        "field": "fileSize",
        "operator": "GREATER_THAN",
        "value": 1000
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
    "storageFindByCriteria": {
      "items": [
        {
          "id": "uuid",
          "fileName": "example.pdf",
          "fileSize": 1024,
          "mimeType": "application/pdf",
          "provider": "S3",
          "url": "https://...",
          "path": "example.pdf",
          "createdAt": "2025-01-01T00:00:00.000Z",
          "updatedAt": "2025-01-01T00:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
}
```

### Mutations

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

**Process:**
1. Gets the default storage provider from factory
2. Uploads file to storage provider
3. Creates storage aggregate with file metadata
4. Saves aggregate to write repository (Prisma)
5. Marks as uploaded and publishes `StorageFileUploadedEvent`
6. Returns storage ID

**Events Published:**
- `StorageFileUploadedEvent` - Published after successful upload

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

**Process:**
1. Gets storage information for each ID
2. Downloads file from storage provider
3. Converts buffer to base64
4. Returns file content with metadata

**Events Published:**
- `StorageFileDownloadedEvent` - Published for each downloaded file

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

**Process:**
1. Asserts storage exists for each ID
2. Gets storage provider based on stored provider type
3. Deletes file from storage provider
4. Deletes record from write repository
5. Publishes `StorageFileDeletedEvent`

**Events Published:**
- `StorageFileDeletedEvent` - Published for each deleted file

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

## Domain Model

### Storage Aggregate

The `StorageAggregate` is the main domain entity that encapsulates storage business logic:

**Properties:**
- `id` - Storage UUID
- `fileName` - File name
- `fileSize` - File size in bytes
- `mimeType` - MIME type
- `provider` - Storage provider (S3, SUPABASE, SERVER_ROUTE)
- `url` - File URL
- `path` - File path in storage
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

**Methods:**
- `update(props, generateEvent)` - Updates storage metadata
- `delete(generateEvent)` - Marks storage as deleted
- `markAsDownloaded(generateEvent)` - Records file download
- `markAsUploaded(generateEvent)` - Records file upload
- `toPrimitives()` - Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **StorageFileNameValueObject** - Validates file name (min length: 1, trimmed)
- **StorageFileSizeValueObject** - Represents file size in bytes
- **StorageMimeTypeValueObject** - Validates MIME type
- **StoragePathValueObject** - Represents file path in storage
- **StorageProviderValueObject** - Validates storage provider enum
- **StorageUrlValueObject** - Represents file URL

### View Model

The `StorageViewModel` is optimized for read operations and stored in MongoDB for fast querying. View models are automatically synchronized via event handlers.

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `StorageWriteRepository`

**Database:** PostgreSQL (tenant-specific)

**Operations:**
- `findById(id: string): Promise<StorageAggregate | null>`
- `findByPath(path: string): Promise<StorageAggregate | null>`
- `save(storage: StorageAggregate): Promise<StorageAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Tenant-aware (uses `BasePrismaTenantRepository`)
- Request-scoped for tenant context
- Indexed on `path` and `provider` for performance

### Read Repository (MongoDB)

**Interface:** `StorageReadRepository`

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

## Event Handlers

### StorageUploadedEventHandler

Handles `StorageFileUploadedEvent`:

1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

This ensures read models are synchronized with write models.

### StorageFileDeletedEventHandler

Handles `StorageFileDeletedEvent`:

1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

This ensures read models are cleaned up when files are deleted.

## Environment Variables

### Storage Provider Selection

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

## Complete Examples

### Upload and Retrieve File

```graphql
# 1. Upload a file
mutation {
  storageUploadFile(file: $file) {
    success
    message
    id
  }
}

# 2. Get file information
query {
  storageFindById(input: { id: "file-id-from-upload" }) {
    id
    fileName
    fileSize
    mimeType
    url
  }
}

# 3. Download file
mutation {
  storageDownloadFiles(input: { ids: ["file-id"] }) {
    content
    fileName
    mimeType
    fileSize
  }
}

# 4. Delete file
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
        operator: EQUALS
        value: "S3"
      }
      {
        field: "fileSize"
        operator: GREATER_THAN
        value: 1000
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

## Error Handling

The module provides detailed error messages:

- **Missing configuration:** Clear error messages indicating which environment variables are required
- **Upload failures:** Provider-specific error messages (`S3UploadFailedException`, `SupabaseUploadFailedException`, `ServerRouteUploadFailedException`)
- **File not found:** `StorageNotFoundException` when storage doesn't exist
- **Download failures:** Provider-specific error messages (`S3DownloadFailedException`, `SupabaseDownloadFailedException`, `ServerRouteDownloadFailedException`)
- **Delete failures:** Provider-specific error messages (`S3DeleteFailedException`, `SupabaseDeleteFailedException`, `ServerRouteDeleteFailedException`)

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
   - Error: `"Tenant ID is required. Please provide x-tenant-id header."`

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

## Best Practices

1. **Provider Selection** - Choose the provider that best fits your infrastructure and requirements
2. **File Naming** - Use meaningful file names as they are used as storage paths
3. **Error Handling** - Always handle provider-specific exceptions appropriately
4. **Event Handling** - Subscribe to storage events for cross-module integration
5. **Tenant Isolation** - All operations are automatically tenant-aware, no additional configuration needed
6. **Read Models** - Use view models for read operations to leverage MongoDB's query capabilities
7. **Lazy Initialization** - Providers are initialized on first use, reducing startup time

## Module Initialization

When the module initializes, it logs the configured storage provider:

```
📦 Storage Provider: S3
```

This helps verify that the correct provider is being used.

