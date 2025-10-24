import { AppResolver } from '@/app.resolver';
import { AuditModule } from '@/audit/audit.module';
import { UserModule } from '@/features/users/user.module';
import { SharedModule } from '@/shared/shared.module';
import '@/shared/transport/graphql/registered-enums.graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

const MODULES = [AuditModule, SharedModule];
const FEATURES = [UserModule];

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
    ...FEATURES,
  ],
  providers: [AppResolver],
})
export class AppModule {}
