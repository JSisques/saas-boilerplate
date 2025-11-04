# @repo/sdk

TypeScript SDK for the SaaS Boilerplate API. Compatible with React Native and web applications.

## Installation

```bash
pnpm add @repo/sdk
```

## Usage

### Basic Setup

```typescript
import { SDK } from '@repo/sdk';

// For Next.js / Web (uses localStorage automatically)
const sdk = new SDK({
  apiUrl: 'http://localhost:4100/api/v1',
});

// For React Native (pass AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SDK } from '@repo/sdk';

const sdk = new SDK({
  apiUrl: 'http://localhost:4100/api/v1',
  storage: AsyncStorage, // Custom storage for React Native
});
```

### Authentication

```typescript
// Login - tokens are automatically saved to storage
const { accessToken, refreshToken } = await sdk.auth.loginByEmail({
  email: 'user@example.com',
  password: 'password123',
});

// Tokens are automatically stored and used in subsequent requests
// No need to manually set the token!

// The SDK automatically:
// - Saves tokens to localStorage (web) or AsyncStorage (React Native)
// - Loads tokens from storage on initialization
// - Includes the access token in all authenticated requests

// Register
const registerResult = await sdk.auth.registerByEmail({
  email: 'newuser@example.com',
  password: 'password123',
});

// Logout
await sdk.auth.logout({ id: 'user-id' });
```

### Users

```typescript
// Find user by ID
const user = await sdk.users.findById({ id: 'user-id' });

// Find users with filters and pagination
const users = await sdk.users.findByCriteria({
  filters: [{ field: 'status', operator: 'EQUALS', value: 'ACTIVE' }],
  sorts: [{ field: 'name', direction: 'ASC' }],
  pagination: { page: 1, perPage: 10 },
});

// Create user
const createResult = await sdk.users.create({
  name: 'John Doe',
  role: 'USER',
  status: 'ACTIVE',
});

// Update user
const updateResult = await sdk.users.update({
  id: 'user-id',
  name: 'Jane Doe',
});

// Delete user
const deleteResult = await sdk.users.delete({ id: 'user-id' });
```

### Tenants

```typescript
// Find tenants
const tenants = await sdk.tenants.findByCriteria({
  pagination: { page: 1, perPage: 10 },
});

// Create tenant
const tenant = await sdk.tenants.create({
  name: 'My Company',
  description: 'A great company',
  email: 'contact@mycompany.com',
});

// Update tenant
await sdk.tenants.update({
  id: 'tenant-id',
  name: 'Updated Company Name',
});

// Delete tenant
await sdk.tenants.delete({ id: 'tenant-id' });
```

### Tenant Members

```typescript
// Find tenant members
const members = await sdk.tenantMembers.findByCriteria({
  filters: [{ field: 'tenantId', operator: 'EQUALS', value: 'tenant-id' }],
});

// Add member
await sdk.tenantMembers.add({
  tenantId: 'tenant-id',
  userId: 'user-id',
  role: 'MEMBER',
});

// Update member role
await sdk.tenantMembers.update({
  id: 'member-id',
  role: 'ADMIN',
});

// Remove member
await sdk.tenantMembers.remove({ id: 'member-id' });
```

### Subscription Plans

```typescript
// Find subscription plans
const plans = await sdk.subscriptionPlans.findByCriteria();

// Create plan
await sdk.subscriptionPlans.create({
  name: 'Pro Plan',
  type: 'PRO',
  priceMonthly: 29.99,
  currency: 'USD',
  interval: 'MONTHLY',
  intervalCount: 1,
  features: ['feature1', 'feature2'],
});
```

### Health Check

```typescript
const health = await sdk.health.check();
console.log(health.status); // 'ok'
```

## Features

- 🔐 **Authentication**: Login, register, logout
- 👥 **User Management**: CRUD operations with filtering and pagination
- 🏢 **Tenant Management**: Create, update, delete tenants
- 👤 **Tenant Members**: Manage team members and roles
- 💳 **Subscription Plans**: Manage billing plans and features
- 📊 **Event Store**: Query event history
- 🏥 **Health Checks**: Monitor API status

## React Native Compatibility

This SDK is fully compatible with React Native and uses only native `fetch` API for HTTP requests. No Node.js-specific dependencies are required.

### Token Storage

The SDK automatically handles token storage:

- **Web/Next.js**: Uses `localStorage` automatically
- **React Native**: Pass `AsyncStorage` as custom storage:

  ```typescript
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const sdk = new SDK({
    apiUrl: 'http://localhost:4100/api/v1',
    storage: AsyncStorage,
  });
  ```

- **Server-side**: Falls back to memory storage (tokens are not persisted)

### Automatic Token Management

- Tokens are automatically saved when you login
- Tokens are automatically loaded from storage on SDK initialization
- Access token is automatically included in all requests
- Use `await sdk.logout()` to clear all stored tokens

## React Hooks (Optional)

For React applications, the SDK provides hooks that manage loading, error, and data states automatically:

```typescript
import { useSDK, useAuth, useUsersList, useUser } from '@repo/sdk/react';

function MyComponent() {
  // Initialize SDK
  const sdk = useSDK({
    apiUrl: 'http://localhost:4100/api/v1',
  });

  // Auth hook with states
  const { login } = useAuth(sdk);

  // Users list hook - automatically fetches on mount
  const users = useUsersList(sdk, {
    pagination: { page: 1, perPage: 10 },
  });

  // Single user hook - automatically fetches when userId changes
  const user = useUser(sdk, 'user-id');

  // Handle login
  const handleLogin = async () => {
    await login.execute({
      email: 'user@example.com',
      password: 'password123',
    });
  };

  // Render with states - perfect for React Native and Web!
  if (login.loading) return <div>Logging in...</div>;
  if (login.error) return <div>Error: {login.error.message}</div>;
  if (login.success && login.data) {
    // Tokens are automatically saved!
  }

  if (users.loading) return <div>Loading users...</div>;
  if (users.error) return <div>Error: {users.error.message}</div>;
  if (users.data) {
    return (
      <div>
        {users.data.items.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }

  return null;
}
```

### Available Hooks

- `useSDK(config)` - Initialize SDK instance
- `useAuth(sdk)` - Authentication operations (login, register, logout)
- `useUsers(sdk)` - User operations (find, create, update, delete)
- `useUsersList(sdk, input?)` - Auto-fetch users list
- `useUser(sdk, userId)` - Auto-fetch single user
- `useTenants(sdk)` - Tenant operations
- `useTenantsList(sdk, input?)` - Auto-fetch tenants list
- `useSubscriptionPlans(sdk)` - Subscription plan operations
- `useHealth(sdk)` - Health check operations
- `useEvents(sdk)` - Event store operations

### Hook States

Each hook returns an object with:

- `data`: The response data (or null) - **Use this to render your UI**
- `error`: Error object (or null) - **Use this to show error messages**
- `loading`: Boolean indicating if request is in progress - **Use this to show loading spinners**
- `success`: Boolean indicating if request completed successfully - **Use this for success feedback**
- `execute` or `fetch`/`mutate`: Function to trigger the operation
- `reset`: Function to reset all states

### Example: React Native Usage

```typescript
import { useSDK, useAuth, useUsersList } from '@repo/sdk/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, Button } from 'react-native';

function MyScreen() {
  const sdk = useSDK(
    {
      apiUrl: 'https://api.example.com/api/v1',
    },
    AsyncStorage, // Pass AsyncStorage for React Native
  );

  const { login } = useAuth(sdk);
  const users = useUsersList(sdk); // Auto-fetches on mount

  const handleLogin = () => {
    login.execute({
      email: 'user@example.com',
      password: 'password123',
    });
  };

  return (
    <View>
      <Button title="Login" onPress={handleLogin} disabled={login.loading} />

      {login.loading && <ActivityIndicator />}
      {login.error && <Text>Error: {login.error.message}</Text>}
      {login.success && <Text>Logged in!</Text>}

      {users.loading && <ActivityIndicator />}
      {users.error && <Text>Error: {users.error.message}</Text>}
      {users.data && (
        <View>
          {users.data.items.map(user => (
            <Text key={user.id}>{user.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions for all operations, inputs, and responses.

## API Reference

### Configuration

```typescript
type GraphQLClientConfig = {
  apiUrl: string;
  accessToken?: string;
  headers?: Record<string, string>;
};
```

### Filter Operators

- `EQUALS`
- `NOT_EQUALS`
- `LIKE`
- `IN`
- `GREATER_THAN`
- `LESS_THAN`
- `GREATER_THAN_OR_EQUAL`
- `LESS_THAN_OR_EQUAL`

### Sort Directions

- `ASC`
- `DESC`
