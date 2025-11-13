# Storage Module

A comprehensive file storage module that supports multiple storage providers (AWS S3, Supabase, and custom server routes) with GraphQL API integration.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Storage Providers](#storage-providers)
- [Environment Variables](#environment-variables)
- [GraphQL API](#graphql-api)
- [File Upload Guide](#file-upload-guide)
- [Examples](#examples)

## Overview

The Storage Module provides a flexible file storage solution with support for multiple storage providers. It follows a CQRS (Command Query Responsibility Segregation) pattern and uses Domain-Driven Design principles.

### Features

- ✅ Multiple storage providers (S3, Supabase, Server Route)
- ✅ GraphQL API for file operations
- ✅ File upload with multipart/form-data support
- ✅ File download and deletion
- ✅ Event-driven architecture
- ✅ Lazy initialization of storage providers
- ✅ Automatic provider selection based on configuration

## Architecture

The module is organized following Clean Architecture principles:

```
storage/
├── application/          # Application layer (CQRS)
│   ├── commands/         # Command handlers
│   ├── queries/          # Query handlers
│   └── event-handlers/  # Event handlers
├── domain/               # Domain layer
│   ├── aggregate/        # Storage aggregate
│   ├── repositories/     # Repository interfaces
│   ├── value-objects/    # Value objects
│   └── enums/           # Domain enums
├── infrastructure/       # Infrastructure layer
│   ├── database/        # Database repositories
│   └── storage-providers/ # Storage provider implementations
└── transport/           # Transport layer
    └── graphql/         # GraphQL resolvers and DTOs
```

## Storage Providers

The module supports three storage providers:

### 1. AWS S3

Stores files in Amazon S3 buckets with presigned URLs for secure access.

**Features:**

- Presigned URLs (1 hour expiration)
- Support for all S3-compatible services
- Configurable region

### 2. Supabase Storage

Stores files in Supabase Storage buckets with public URLs.

**Features:**

- Public URL generation
- Bucket-based organization
- Simple configuration

### 3. Server Route

Custom HTTP-based storage provider for custom storage solutions.

**Features:**

- RESTful API integration
- Custom authentication
- Flexible endpoint configuration

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

## GraphQL API

### Queries

#### Find Storage by ID

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

#### Find Storages by Criteria

```graphql
query FindStoragesByCriteria($input: StorageFindByCriteriaRequestDto!) {
  storageFindByCriteria(input: $input) {
    data {
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
    "filters": {},
    "sorts": [],
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

### Mutations

#### Upload File

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

#### Delete File

```graphql
mutation StorageDeleteFile($input: StorageDeleteFileRequestDto!) {
  storageDeleteFile(input: $input) {
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
    "id": "uuid-here"
  }
}
```

## File Upload Guide

File uploads use the GraphQL multipart request specification. The module requires the `graphql-upload` middleware to be configured (already set up in `main.ts`).

### Configuration

The upload middleware is configured in `main.ts`:

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

````

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
````

3. **Delete a file:**
   ```graphql
   mutation {
     storageDeleteFile(input: { id: "file-id" }) {
       success
       message
     }
   }
   ```

```

### Error Handling

The module provides detailed error messages:

- **Missing configuration:** Clear error messages indicating which environment variables are required
- **Upload failures:** Provider-specific error messages
- **File not found:** Appropriate error responses for missing files

## Module Initialization

When the module initializes, it logs the configured storage provider:

```

📦 Storage Provider: S3

```

This helps verify that the correct provider is being used.

## Architecture Notes

### Lazy Initialization

Storage providers are lazily initialized to avoid startup errors when configuration is missing. Each provider only initializes its client when actually used.

### Event-Driven

File uploads trigger events that are handled asynchronously:

- `StorageFileUploadedEvent` - Published after successful file upload

### CQRS Pattern

The module follows CQRS:

- **Commands:** Upload, Delete, Download
- **Queries:** Find by ID, Find by Criteria
- **Events:** File uploaded event

### Repository Pattern

Two repositories are used:

- **Write Repository (Prisma):** For write operations and aggregate persistence
- **Read Repository (MongoDB):** For read operations and view models

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

## License

This module is part of the SaaS Boilerplate project.

```
