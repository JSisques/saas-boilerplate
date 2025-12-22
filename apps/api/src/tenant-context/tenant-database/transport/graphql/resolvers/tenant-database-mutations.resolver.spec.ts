import { TenantDatabaseCreateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-create/tenant-database-create.command';
import { TenantDatabaseDeleteCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-delete/tenant-database-delete.command';
import { TenantDatabaseUpdateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseCreateRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-create.request.dto';
import { TenantDatabaseDeleteRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-delete.request.dto';
import { TenantDatabaseUpdateRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-update.request.dto';
import { TenantDatabaseMutationsResolver } from '@/tenant-context/tenant-database/transport/graphql/resolvers/tenant-database-mutations.resolver';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';

describe('TenantDatabaseMutationsResolver', () => {
  let resolver: TenantDatabaseMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new TenantDatabaseMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('tenantDatabaseCreate', () => {
    it('should create tenant database successfully', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseCreateRequestDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        databaseUrl: 'postgresql://localhost:5432/tenant_db_001',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant database created successfully',
        id: tenantDatabaseId,
      };

      mockCommandBus.execute.mockResolvedValue(tenantDatabaseId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantDatabaseCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDatabaseCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantDatabaseCreateCommand);
      expect(command.tenantId.value).toBe(input.tenantId);
      expect(command.databaseName.value).toBe(input.databaseName);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant database created successfully',
        id: tenantDatabaseId,
      });
    });

    it('should handle errors when creating tenant database', async () => {
      const input: TenantDatabaseCreateRequestDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        databaseUrl: 'postgresql://localhost:5432/tenant_db_001',
      };

      const error = new Error('Tenant database creation failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantDatabaseCreate(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDatabaseCreateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('tenantDatabaseUpdate', () => {
    it('should update tenant database successfully', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseUpdateRequestDto = {
        id: tenantDatabaseId,
        databaseName: 'tenant_db_updated',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '2.0.0',
        lastMigrationAt: new Date('2024-02-01T10:00:00Z'),
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant database updated successfully',
        id: tenantDatabaseId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantDatabaseUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDatabaseUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantDatabaseUpdateCommand);
      expect(command.id.value).toBe(tenantDatabaseId);
      expect(command.databaseName?.value).toBe('tenant_db_updated');
      expect(command.status?.value).toBe(TenantDatabaseStatusEnum.ACTIVE);
      expect(command.schemaVersion?.value).toBe('2.0.0');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant database updated successfully',
        id: tenantDatabaseId,
      });
    });

    it('should update tenant database with partial fields', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseUpdateRequestDto = {
        id: tenantDatabaseId,
        status: TenantDatabaseStatusEnum.MIGRATING,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant database updated successfully',
        id: tenantDatabaseId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantDatabaseUpdate(input);

      expect(result).toBe(mutationResponse);
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.status?.value).toBe(TenantDatabaseStatusEnum.MIGRATING);
      expect(command.databaseName).toBeUndefined();
    });

    it('should handle errors when updating tenant database', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseUpdateRequestDto = {
        id: tenantDatabaseId,
        databaseName: 'tenant_db_updated',
      };

      const error = new Error('Tenant database update failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantDatabaseUpdate(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDatabaseUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('tenantDatabaseDelete', () => {
    it('should delete tenant database successfully', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseDeleteRequestDto = {
        id: tenantDatabaseId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant database deleted successfully',
        id: tenantDatabaseId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantDatabaseDelete(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDatabaseDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantDatabaseDeleteCommand);
      expect(command.id.value).toBe(tenantDatabaseId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant database deleted successfully',
        id: tenantDatabaseId,
      });
    });

    it('should handle errors when deleting tenant database', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDatabaseDeleteRequestDto = {
        id: tenantDatabaseId,
      };

      const error = new Error('Tenant database deletion failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantDatabaseDelete(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDatabaseDeleteCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
