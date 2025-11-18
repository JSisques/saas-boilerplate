import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthPrismaMapper } from '@/auth-context/auth/infrastructure/database/prisma/mappers/auth-prisma.mapper';
import { BasePrismaRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthPrismaRepository
  extends BasePrismaRepository
  implements AuthWriteRepository
{
  constructor(
    prisma: PrismaService,
    private readonly authPrismaMapper: AuthPrismaMapper,
  ) {
    super(prisma);
    this.logger = new Logger(AuthPrismaRepository.name);
  }

  /**
   * Finds a auth by their id
   *
   * @param id - The id of the auth to find
   * @returns The auth if found, null otherwise
   */
  async findById(id: string): Promise<AuthAggregate | null> {
    const authData = await this.prismaService.auth.findUnique({
      where: { id },
    });

    if (!authData) {
      return null;
    }

    return this.authPrismaMapper.toDomainEntity(authData);
  }

  /**
   * Finds a auth by their email
   *
   * @param email - The email of the auth to find
   * @returns The auth if found, null otherwise
   */
  async findByEmail(email: string): Promise<AuthAggregate | null> {
    const authData = await this.prismaService.auth.findFirst({
      where: { email },
    });

    if (!authData) {
      return null;
    }

    return this.authPrismaMapper.toDomainEntity(authData);
  }

  /**
   * Finds a auth by their user id
   *
   * @param userId - The user id of the auth to find
   * @returns The auth if found, null otherwise
   */
  async findByUserId(userId: string): Promise<AuthAggregate | null> {
    const authData = await this.prismaService.auth.findFirst({
      where: { userId },
    });

    if (!authData) {
      return null;
    }

    return this.authPrismaMapper.toDomainEntity(authData);
  }

  /**
   * Saves a auth
   *
   * @param auth - The auth to save
   * @returns The saved auth
   */
  async save(auth: AuthAggregate): Promise<AuthAggregate> {
    const authData = this.authPrismaMapper.toPrismaData(auth);

    const result = await this.prismaService.auth.upsert({
      where: { id: auth.id.value },
      update: authData,
      create: authData,
    });

    return this.authPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a auth
   *
   * @param auth - The auth to delete
   * @returns True if the auth was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting auth by id: ${id}`);

    await this.prismaService.auth.delete({
      where: { id },
    });

    return true;
  }
}
