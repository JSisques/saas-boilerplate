/**
 * Example usage of the SDK
 *
 * This file is for documentation purposes only and won't be compiled.
 */

import { SDK } from './index.js';

// Initialize the SDK
const sdk = new SDK({
  apiUrl: 'http://localhost:4100/api/v1',
});

// Example: Login
async function loginExample() {
  try {
    const { accessToken, refreshToken } = await sdk.auth.loginByEmail({
      email: 'user@example.com',
      password: 'password123',
    });

    // Set the access token for subsequent requests
    sdk.setAccessToken(accessToken);

    console.log('Login successful!', { accessToken, refreshToken });
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Example: Register
async function registerExample() {
  try {
    const result = await sdk.auth.registerByEmail({
      email: 'newuser@example.com',
      password: 'password123',
    });

    console.log('Registration successful!', result);
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Example: Get user by ID
async function getUserExample() {
  try {
    const user = await sdk.users.findById({
      id: 'user-id-here',
    });

    console.log('User found:', user);
  } catch (error) {
    console.error('Failed to get user:', error);
  }
}

// Example: Find users with criteria
async function findUsersExample() {
  try {
    const result = await sdk.users.findByCriteria({
      filters: [
        {
          field: 'status',
          operator: 'EQUALS',
          value: 'ACTIVE',
        },
      ],
      sorts: [
        {
          field: 'name',
          direction: 'ASC',
        },
      ],
      pagination: {
        page: 1,
        perPage: 10,
      },
    });

    console.log('Users found:', result);
  } catch (error) {
    console.error('Failed to find users:', error);
  }
}

// Example: Create tenant
async function createTenantExample() {
  try {
    const result = await sdk.tenants.create({
      name: 'My Company',
      description: 'A great company',
      email: 'contact@mycompany.com',
    });

    console.log('Tenant created:', result);
  } catch (error) {
    console.error('Failed to create tenant:', error);
  }
}

// Example: Health check
async function healthCheckExample() {
  try {
    const health = await sdk.health.check();
    console.log('API health:', health);
  } catch (error) {
    console.error('Health check failed:', error);
  }
}
