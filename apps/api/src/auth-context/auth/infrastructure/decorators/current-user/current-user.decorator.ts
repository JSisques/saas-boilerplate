import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Current User Decorator
 * Extracts the authenticated user from the request
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthAggregate => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
