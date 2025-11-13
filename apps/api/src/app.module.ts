import { AppResolver } from '@/app.resolver';
import { AuthContextModule } from '@/auth-context/auth-context.module';
import { BillingContextModule } from '@/billing-context/billing-context.module';
import { EventContextModule } from '@/event-store-context/event-store-context.module';
import { FeaturesModule } from '@/features/features.module';
import { HealthContextModule } from '@/health-context/health-context.module';
import { LLMContextModule } from '@/llm-context/llm-context.module';
import { LoggingContextModule } from '@/logging-context/logging-context.module';
import { SharedModule } from '@/shared/shared.module';
import '@/shared/transport/graphql/registered-enums.graphql';
import { StorageContextModule } from '@/storage-context/storage-context.module';
import { TenantContextModule } from '@/tenant-context/tenant-context.module';
import { UserContextModule } from '@/user-context/user-context.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

const CONTEXT_MODULES = [
  LoggingContextModule,
  EventContextModule,
  AuthContextModule,
  TenantContextModule,
  UserContextModule,
  HealthContextModule,
  BillingContextModule,
  LLMContextModule,
  StorageContextModule,
];

const MODULES = [FeaturesModule, SharedModule];

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
    }),
    ...MODULES,
    ...CONTEXT_MODULES,
  ],
  providers: [AppResolver],
})
export class AppModule {}
