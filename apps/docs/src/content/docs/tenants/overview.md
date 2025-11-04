---
title: Overview
description: Comprehensive guide to the Tenant Context module
---

The **Tenant Context** module is a core component that provides multi-tenancy capabilities. This module enables your application to support multiple isolated tenants, each with their own configuration, members, and resources.

## What is Multi-Tenancy?

Multi-tenancy is an architecture where a single instance of your application serves multiple customers (tenants). Each tenant's data is isolated and secure, ensuring that one tenant cannot access another tenant's information.

## Module Structure

The Tenant Context module is composed of two main sub-modules:

1. **Tenants Module** - Manages tenant entities, their configuration, and lifecycle
2. **Tenant Members Module** - Manages user membership within tenants and role-based access

## Key Features

### Tenant Management

- **Create, update, and delete tenants** with comprehensive configuration options
- **Unique slug validation** to ensure tenant identifiers are unique
- **Status management** (Active, Inactive, Blocked) for tenant lifecycle control
- **Rich configuration options** including branding, contact information, localization, and resource limits

### Tenant Member Management

- **Add, update, and remove members** from tenants
- **Role-based access control** with four role types: Owner, Admin, Member, and Guest
- **Member queries** to find members by various criteria
- **Event-driven architecture** for member lifecycle changes

### Architecture Patterns

The module follows **Domain-Driven Design (DDD)** principles and implements:

- **CQRS (Command Query Responsibility Segregation)** - Separates read and write operations
- **Event Sourcing** - Tracks all changes through domain events
- **Aggregate Roots** - Encapsulates business logic within domain aggregates
- **Value Objects** - Ensures data integrity through strongly-typed value objects

### Database Support

The module supports multiple database implementations:

- **Prisma** - Used for write operations (command side)
- **MongoDB** - Used for read operations (query side) with optimized read models

### GraphQL API

The module exposes a complete GraphQL API with:

- **Queries** - Find tenants and tenant members by various criteria
- **Mutations** - Create, update, and delete operations
- **Type-safe DTOs** - Full TypeScript support with GraphQL schema

## Use Cases

The Tenant Context module is essential for:

- **SaaS Applications** - Enable multi-tenant architecture
- **White-label Solutions** - Customize branding per tenant
- **Resource Management** - Set limits on users, storage, and API calls per tenant
- **Access Control** - Manage user permissions within tenants
- **Billing Integration** - Associate subscriptions and payments with tenants

## Module Integration

The Tenant Context module integrates with other modules in the system:

- **User Context** - Links users to tenants through tenant members
- **Billing Context** - Associates billing and subscriptions with tenants
- **Event Store Context** - Persists domain events for tenant operations
- **Auth Context** - Provides tenant-aware authentication and authorization

## Next Steps

- Learn about [Tenants](./tenants.md) - Detailed tenant management
- Learn about [Tenant Members](./tenant-members.md) - Member and role management
