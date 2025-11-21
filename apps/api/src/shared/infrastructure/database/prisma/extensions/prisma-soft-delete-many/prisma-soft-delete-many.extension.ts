import { Prisma } from '@prisma/client';

export const prismaSoftDeleteManyExtension = Prisma.defineExtension({
  name: 'softDeleteMany',
  model: {
    $allModels: {
      async deleteMany<M, A>(
        this: M,
        args: Prisma.Args<M, 'deleteMany'>,
      ): Promise<Prisma.Result<M, A, 'updateMany'>> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).updateMany({
          where: args.where,
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});
