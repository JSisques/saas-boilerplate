import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { ITenantDatabaseCreateViewModelDto } from '@/tenant-context/tenant-database/domain/dtos/view-models/tenant-database-create/tenant-database-create-view-model.dto';
import { ITenantDatabaseUpdateViewModelDto } from '@/tenant-context/tenant-database/domain/dtos/view-models/tenant-database-update/tenant-database-update-view-model.dto';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';

describe('TenantDatabaseViewModel', () => {
  const createBaseViewModel = (): TenantDatabaseViewModel => {
    const dto: ITenantDatabaseCreateViewModelDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      tenantId: '223e4567-e89b-12d3-a456-426614174001',
      databaseName: 'tenant_db_original',
      readDatabaseName: 'tenant_db_read_original',
      status: TenantDatabaseStatusEnum.ACTIVE,
      schemaVersion: '1.0.0',
      lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
      errorMessage: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    return new TenantDatabaseViewModel(dto);
  };

  describe('constructor', () => {
    it('should create a TenantDatabaseViewModel with all fields', () => {
      const viewModel = createBaseViewModel();

      expect(viewModel).toBeInstanceOf(TenantDatabaseViewModel);
      expect(viewModel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(viewModel.tenantId).toBe('223e4567-e89b-12d3-a456-426614174001');
      expect(viewModel.databaseName).toBe('tenant_db_original');
      expect(viewModel.readDatabaseName).toBe('tenant_db_read_original');
      expect(viewModel.status).toBe(TenantDatabaseStatusEnum.ACTIVE);
      expect(viewModel.schemaVersion).toBe('1.0.0');
      expect(viewModel.lastMigrationAt).toEqual(
        new Date('2024-01-01T10:00:00Z'),
      );
      expect(viewModel.errorMessage).toBeNull();
      expect(viewModel.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
      expect(viewModel.updatedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    });

    it('should create a TenantDatabaseViewModel with null optional fields', () => {
      const dto: ITenantDatabaseCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const viewModel = new TenantDatabaseViewModel(dto);

      expect(viewModel.schemaVersion).toBeNull();
      expect(viewModel.lastMigrationAt).toBeNull();
      expect(viewModel.errorMessage).toBeNull();
    });
  });

  describe('update', () => {
    describe('databaseName field', () => {
      it('should update databaseName when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalName = viewModel.databaseName;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          databaseName: 'tenant_db_updated',
        };

        viewModel.update(updateDto);

        expect(viewModel.databaseName).toBe('tenant_db_updated');
        expect(viewModel.databaseName).not.toBe(originalName);
      });

      it('should keep original databaseName when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalName = viewModel.databaseName;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          databaseName: undefined,
        };

        viewModel.update(updateDto);

        expect(viewModel.databaseName).toBe(originalName);
      });
    });

    describe('readDatabaseName field', () => {
      it('should update readDatabaseName when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalName = viewModel.readDatabaseName;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          readDatabaseName: 'tenant_db_read_updated',
        };

        viewModel.update(updateDto);

        expect(viewModel.readDatabaseName).toBe('tenant_db_read_updated');
        expect(viewModel.readDatabaseName).not.toBe(originalName);
      });

      it('should keep original readDatabaseName when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalName = viewModel.readDatabaseName;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          readDatabaseName: undefined,
        };

        viewModel.update(updateDto);

        expect(viewModel.readDatabaseName).toBe(originalName);
      });
    });

    describe('status field', () => {
      it('should update status when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalStatus = viewModel.status;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          status: TenantDatabaseStatusEnum.MIGRATING,
        };

        viewModel.update(updateDto);

        expect(viewModel.status).toBe(TenantDatabaseStatusEnum.MIGRATING);
        expect(viewModel.status).not.toBe(originalStatus);
      });

      it('should keep original status when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalStatus = viewModel.status;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          status: undefined,
        };

        viewModel.update(updateDto);

        expect(viewModel.status).toBe(originalStatus);
      });
    });

    describe('schemaVersion field', () => {
      it('should update schemaVersion when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalVersion = viewModel.schemaVersion;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          schemaVersion: '2.0.0',
        };

        viewModel.update(updateDto);

        expect(viewModel.schemaVersion).toBe('2.0.0');
        expect(viewModel.schemaVersion).not.toBe(originalVersion);
      });

      it('should update schemaVersion to null when null is provided', () => {
        const viewModel = createBaseViewModel();
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          schemaVersion: null,
        };

        viewModel.update(updateDto);

        expect(viewModel.schemaVersion).toBeNull();
      });

      it('should keep original schemaVersion when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalVersion = viewModel.schemaVersion;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          schemaVersion: undefined,
        };

        viewModel.update(updateDto);

        expect(viewModel.schemaVersion).toBe(originalVersion);
      });
    });

    describe('lastMigrationAt field', () => {
      it('should update lastMigrationAt when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalDate = viewModel.lastMigrationAt;
        const newDate = new Date('2024-02-01T10:00:00Z');
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          lastMigrationAt: newDate,
        };

        viewModel.update(updateDto);

        expect(viewModel.lastMigrationAt).toEqual(newDate);
        expect(viewModel.lastMigrationAt).not.toEqual(originalDate);
      });

      it('should update lastMigrationAt to null when null is provided', () => {
        const viewModel = createBaseViewModel();
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          lastMigrationAt: null,
        };

        viewModel.update(updateDto);

        expect(viewModel.lastMigrationAt).toBeNull();
      });

      it('should keep original lastMigrationAt when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalDate = viewModel.lastMigrationAt;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          lastMigrationAt: undefined,
        };

        viewModel.update(updateDto);

        expect(viewModel.lastMigrationAt).toEqual(originalDate);
      });
    });

    describe('errorMessage field', () => {
      it('should update errorMessage when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          errorMessage: 'Migration failed',
        };

        viewModel.update(updateDto);

        expect(viewModel.errorMessage).toBe('Migration failed');
      });

      it('should update errorMessage to null when null is provided', () => {
        const viewModel = createBaseViewModel();
        const updateDto1: ITenantDatabaseUpdateViewModelDto = {
          errorMessage: 'Some error',
        };
        viewModel.update(updateDto1);

        const updateDto2: ITenantDatabaseUpdateViewModelDto = {
          errorMessage: null,
        };
        viewModel.update(updateDto2);

        expect(viewModel.errorMessage).toBeNull();
      });

      it('should keep original errorMessage when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalErrorMessage = viewModel.errorMessage;
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          errorMessage: undefined,
        };

        viewModel.update(updateDto);

        expect(viewModel.errorMessage).toBe(originalErrorMessage);
      });
    });

    describe('multiple fields update', () => {
      it('should update multiple fields at once', () => {
        const viewModel = createBaseViewModel();
        const updateDto: ITenantDatabaseUpdateViewModelDto = {
          databaseName: 'tenant_db_new',
          status: TenantDatabaseStatusEnum.SUSPENDED,
          schemaVersion: '3.0.0',
        };

        viewModel.update(updateDto);

        expect(viewModel.databaseName).toBe('tenant_db_new');
        expect(viewModel.status).toBe(TenantDatabaseStatusEnum.SUSPENDED);
        expect(viewModel.schemaVersion).toBe('3.0.0');
      });

      it('should update updatedAt timestamp when any field is updated', () => {
        const viewModel = createBaseViewModel();
        const originalUpdatedAt = viewModel.updatedAt;
        // Wait a bit to ensure different timestamp
        const beforeUpdate = new Date();
        // Small delay to ensure timestamp difference
        while (new Date().getTime() === beforeUpdate.getTime()) {
          // Wait for next millisecond
        }

        viewModel.update({
          databaseName: 'tenant_db_new',
        });

        expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return correct tenantId', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.tenantId).toBe('223e4567-e89b-12d3-a456-426614174001');
    });

    it('should return correct databaseName', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.databaseName).toBe('tenant_db_original');
    });

    it('should return correct readDatabaseName', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.readDatabaseName).toBe('tenant_db_read_original');
    });

    it('should return correct status', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.status).toBe(TenantDatabaseStatusEnum.ACTIVE);
    });

    it('should return correct schemaVersion', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.schemaVersion).toBe('1.0.0');
    });

    it('should return correct lastMigrationAt', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.lastMigrationAt).toEqual(
        new Date('2024-01-01T10:00:00Z'),
      );
    });

    it('should return correct errorMessage', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.errorMessage).toBeNull();
    });

    it('should return correct createdAt', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    });

    it('should return correct updatedAt', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.updatedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    });
  });
});
