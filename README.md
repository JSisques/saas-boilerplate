# SaaS Boilerplate

A complete and scalable boilerplate for building modern SaaS applications. This project uses a Turborepo monorepo and is designed with DDD (Domain-Driven Design), CQRS (Command Query Responsibility Segregation), and Event-Driven Architecture.

## 🏗️ Project Architecture

This is a monorepo built with **Turborepo** that includes multiple applications and shared packages, all written in **TypeScript**.

### 📦 Monorepo Structure

```
saas-boilerplate/
├── apps/
│   ├── api/          # Backend API with DDD/CQRS architecture
│   ├── web/          # Next.js web application for end users
│   ├── admin/        # Next.js admin panel
│   ├── mobile/       # React Native mobile app with Expo
│   └── docs/         # Documentation site with Astro and Starlight
├── packages/
│   ├── sdk/          # Shared TypeScript SDK for clients
│   ├── ui/           # Shared UI components
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
```

## 🚀 Applications and Packages

### 🔌 API (`apps/api`)

Backend API built with **NestJS** implementing DDD, CQRS, and Event-Driven Architecture. Features GraphQL API with Apollo Server, PostgreSQL (via Prisma) for transactional data, and MongoDB for Event Store.

Includes bounded contexts: Auth, User, Tenant, Billing, Event Store, and Health.

### 🌐 Web App (`apps/web`)

Next.js 16 web application for end users with React 19 and Tailwind CSS 4.

### 🛠️ Admin Panel (`apps/admin`)

Next.js 16 administration panel with integrated SDK for API communication.

### 📱 Mobile App (`apps/mobile`)

Cross-platform React Native application with Expo, supporting iOS, Android, and Web.

### 📚 Docs (`apps/docs`)

Documentation site built with Astro and Starlight.

### 📦 SDK (`packages/sdk`)

Shared TypeScript SDK for interacting with the API from any client. Includes GraphQL client, React hooks, and automatic token management. Compatible with web and React Native.

See `packages/sdk/README.md` for complete usage examples.

## 🛠️ Main Technologies

- **Monorepo**: Turborepo
- **Backend**: NestJS, GraphQL, Prisma, MongoDB
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Mobile**: React Native, Expo
- **Docs**: Astro, Starlight
- **Language**: TypeScript 5
- **Package Manager**: pnpm 9
- **Databases**: PostgreSQL, MongoDB
- **ORM**: Prisma

## 📋 Prerequisites

- **Node.js**: >= 18
- **pnpm**: 9.0.0 (recommended to install globally)
- **PostgreSQL**: Main database
- **MongoDB**: For Event Store

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd saas-boilerplate
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create `.env` files in the corresponding folders:

**`apps/api/.env`**:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/saas_db"
MONGODB_URI="mongodb://localhost:27017/saas_event_store"
JWT_SECRET="your-jwt-secret-key"
FRONTEND_URL="http://localhost:3000"
PORT=4100
```

### 4. Setup Database

```bash
# From the project root
cd apps/api

# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# (Optional) Open Prisma Studio
pnpm prisma:studio
```

### 5. Start Services

#### Development (all apps)

```bash
# From the project root
pnpm dev
```

#### Development for a specific app

```bash
# API
pnpm dev --filter=api

# Web App
pnpm dev --filter=web

# Admin Panel
pnpm dev --filter=admin

# Mobile (requires Expo CLI)
pnpm dev --filter=mobile

# Docs
pnpm dev --filter=docs
```

### 6. Access Applications

- **GraphQL API**: http://localhost:4100/api/v1/graphql
- **GraphQL Playground**: http://localhost:4100/api/v1/graphql (development mode)
- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001 (Next.js default port)
- **Docs**: http://localhost:4321 (Astro default port)

## 📜 Available Scripts

### Global Scripts (project root)

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm dev --filter=<app>     # Start a specific app

# Build
pnpm build                  # Build all apps and packages
pnpm build --filter=<app>   # Build a specific app

# Linting
pnpm lint                   # Run linting across the project
pnpm lint --filter=<app>    # Run linting for a specific app

# Type Checking
pnpm check-types            # Verify TypeScript types across the project

# Formatting
pnpm format                 # Format code with Prettier
```

### API Scripts (`apps/api`)

```bash
# Development
pnpm dev                    # Watch mode
pnpm start                  # Production
pnpm debug                 # Debug mode

# Database
pnpm prisma:generate        # Generate Prisma Client
pnpm prisma:migrate         # Run migrations
pnpm prisma:studio          # Open Prisma Studio
pnpm prisma:push            # Push schema without migrations
pnpm prisma:seed            # Run seeds

# Testing
pnpm test                   # Run tests
pnpm test:watch             # Watch mode
pnpm test:cov               # With coverage
pnpm test:e2e               # End-to-end tests
```

## 🏛️ API Architecture

### DDD (Domain-Driven Design)

The API is organized into **Bounded Contexts**, each representing a specific business domain:

- Each context is independent and has its own domain model
- Contexts communicate through domain events
- Clear separation between domain, application, and infrastructure

### CQRS (Command Query Responsibility Segregation)

- **Commands**: Operations that modify state (write)
- **Queries**: Operations that only read data (read)
- Separation of read and write models
- Independent optimization of each side

### Event-Driven Architecture

- **Event Store**: All domain events are stored in MongoDB
- **Event Sourcing**: State reconstruction from events
- **Event Handlers**: Asynchronous event processing
- **Event Replay**: Ability to replay historical events

### Operation Flow

1. **Transport Layer** (GraphQL Resolver) receives the request
2. **Application Layer** (Command/Query Handler) processes the logic
3. **Domain Layer** (Aggregate) executes business rules
4. **Infrastructure Layer** (Repository) persists changes
5. **Event Bus** publishes domain events
6. **Event Handlers** process events (update read models, send notifications, etc.)

## 🔐 Authentication and Authorization

JWT-based authentication with multi-provider support (Local, Google, Apple). Role-based access control at user and tenant levels.

## 💳 Billing and Subscriptions

Subscription management with configurable plans, multi-currency support, and Stripe integration ready. Supports trial periods and automatic/manual renewal.

## 📊 Event Store

Complete event sourcing implementation with audit trail, event replay capabilities, and full traceability of all operations.

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Tests with coverage
pnpm test:cov

# End-to-end tests
pnpm test:e2e
```

## 📖 Documentation

### Project Documentation

Documentation is available in `apps/docs` and can be accessed by running:

```bash
pnpm dev --filter=docs
```

### API Documentation

- **GraphQL Playground**: http://localhost:4100/api/v1/graphql
- **GraphQL Schema**: Automatically generated in `apps/api/src/schema.gql`

### SDK Documentation

See the SDK README at `packages/sdk/README.md` for complete usage examples.

## 🔧 Editor Configuration

The project includes shared configurations for:

- **ESLint**: Configuration in `packages/eslint-config`
- **TypeScript**: Configurations in `packages/typescript-config`
- **Prettier**: Global configuration

## 🚢 Deployment

### API

1. Configure production environment variables
2. Run migrations: `pnpm prisma:migrate deploy`
3. Build: `pnpm build --filter=api`
4. Start: `pnpm start --filter=api`

### Next.js Applications (Web/Admin)

1. Build: `pnpm build --filter=web` or `pnpm build --filter=admin`
2. Start: `pnpm start --filter=web` or `pnpm start --filter=admin`

### Mobile

```bash
# Production build
cd apps/mobile
eas build --platform ios
eas build --platform android
```

### Docs

```bash
# Static build
pnpm build --filter=docs

# Output will be in apps/docs/dist/
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is an open-source boilerplate. See the LICENSE file for more details.

## 🎯 Roadmap

- [ ] Complete Stripe integration
- [ ] Webhooks for external events
- [ ] Notifications (email, push, SMS)
- [ ] Analytics and metrics
- [ ] Complete E2E tests
- [ ] Improved API documentation
- [ ] Docker and Docker Compose
- [ ] CI/CD pipelines

## 📞 Support

For questions or support, open an issue in the repository.

---

**Built with ❤️ using software architecture best practices**
