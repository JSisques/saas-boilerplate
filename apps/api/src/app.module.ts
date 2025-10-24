import { AppResolver } from '@/app.resolver';
import { UserModule } from '@/features/users/user.module';
import { SharedModule } from '@/shared/shared.module';
import '@/shared/transport/graphql/registered-enums.graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

const FEATURES = [UserModule];

@Module({
  imports: [
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
    SharedModule,
    CqrsModule.forRoot(),
    ...FEATURES,
  ],
  providers: [AppResolver],
})
export class AppModule {}
