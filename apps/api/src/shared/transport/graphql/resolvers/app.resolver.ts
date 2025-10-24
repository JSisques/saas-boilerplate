import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }

  @Query(() => String)
  health(): string {
    return 'OK';
  }
}
