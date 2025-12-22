import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { ITenantDatabaseCreateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-create/tenant-database-create.dto';
import { ITenantDatabaseUpdateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-update/tenant-database-update.dto';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseCreatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-created/tenant-database-created.event';
import { TenantDatabaseDeletedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-deleted/tenant-database-deleted.event';
import { TenantDatabaseUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-updated/tenant-database-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseErrorMessageValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-error-message/tenant-database-error-message.vo';
import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

describe('TenantDatabaseAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): TenantDatabaseAggregate => {
    const dto: ITenantDatabaseCreateDto = {
      id: new TenantDatabaseUuidValueObject(
        '123e4567-e89b-12d3-a456-426614174000',
      ),
      tenantId: new TenantUuidValueObject(
        '223e4567-e89b-12d3-a456-426614174001',
      ),
      databaseName: new TenantDatabaseNameValueObject('tenant_db_original'),
      readDatabaseName: new TenantDatabaseNameValueObject(
        'tenant_db_read_original',
      ),
      status: new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.ACTIVE,
      ),
      schemaVersion: new TenantDatabaseSchemaVersionValueObject('1.0.0'),
      lastMigrationAt: new TenantDatabaseLastMigrationAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      ),
      errorMessage: null,
      createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
    };

    return new TenantDatabaseAggregate(dto, generateEvent);
  };

  describe('constructor', () => {
    it('should create a TenantDatabaseAggregate with all fields', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate).toBeInstanceOf(TenantDatabaseAggregate);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.tenantId.value).toBe(
        '223e4567-e89b-12d3-a456-426614174001',
      );
      expect(aggregate.databaseName.value).toBe('tenant_db_original');
      expect(aggregate.readDatabaseName.value).toBe('tenant_db_read_original');
      expect(aggregate.status.value).toBe(TenantDatabaseStatusEnum.ACTIVE);
      expect(aggregate.schemaVersion?.value).toBe('1.0.0');
      expect(aggregate.lastMigrationAt?.value).toEqual(
        new Date('2024-01-01T10:00:00Z'),
      );
      expect(aggregate.errorMessage).toBeNull();
    });

    it('should create a TenantDatabaseAggregate with null optional fields', () => {
      const dto: ITenantDatabaseCreateDto = {
        id: new TenantDatabaseUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        databaseName: new TenantDatabaseNameValueObject('tenant_db'),
        readDatabaseName: new TenantDatabaseNameValueObject('tenant_db_read'),
        status: new TenantDatabaseStatusValueObject(
          TenantDatabaseStatusEnum.PROVISIONING,
        ),
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = new TenantDatabaseAggregate(dto, false);

      expect(aggregate.schemaVersion).toBeNull();
      expect(aggregate.lastMigrationAt).toBeNull();
      expect(aggregate.errorMessage).toBeNull();
    });

    it('should generate TenantDatabaseCreatedEvent by default', () => {
      const aggregate = createBaseAggregate(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantDatabaseCreatedEvent);

      const event = events[0] as TenantDatabaseCreatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(TenantDatabaseAggregate.name);
      expect(event.eventType).toBe(TenantDatabaseCreatedEvent.name);
      expect(event.data.id).toBe(aggregate.id.value);
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('update', () => {
    describe('databaseName field', () => {
      it('should update databaseName when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalName = aggregate.databaseName.value;
        const newName = new TenantDatabaseNameValueObject('tenant_db_updated');

        aggregate.update({ databaseName: newName }, false);

        expect(aggregate.databaseName.value).toBe('tenant_db_updated');
        expect(aggregate.databaseName.value).not.toBe(originalName);
      });

      it('should keep original databaseName when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalName = aggregate.databaseName.value;

        aggregate.update({ databaseName: undefined }, false);

        expect(aggregate.databaseName.value).toBe(originalName);
      });

      it('should generate TenantDatabaseUpdatedEvent when updating databaseName with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit(); // Clear creation event
        const newName = new TenantDatabaseNameValueObject('tenant_db_updated');

        aggregate.update({ databaseName: newName }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(TenantDatabaseUpdatedEvent);

        const event = events[0] as TenantDatabaseUpdatedEvent;
        expect(event.aggregateId).toBe(aggregate.id.value);
        expect(event.aggregateType).toBe(TenantDatabaseAggregate.name);
        expect(event.eventType).toBe(TenantDatabaseUpdatedEvent.name);
        expect(event.data.databaseName).toBe('tenant_db_updated');
      });
    });

    describe('readDatabaseName field', () => {
      it('should update readDatabaseName when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalName = aggregate.readDatabaseName.value;
        const newName = new TenantDatabaseNameValueObject(
          'tenant_db_read_updated',
        );

        aggregate.update({ readDatabaseName: newName }, false);

        expect(aggregate.readDatabaseName.value).toBe('tenant_db_read_updated');
        expect(aggregate.readDatabaseName.value).not.toBe(originalName);
      });

      it('should keep original readDatabaseName when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalName = aggregate.readDatabaseName.value;

        aggregate.update({ readDatabaseName: undefined }, false);

        expect(aggregate.readDatabaseName.value).toBe(originalName);
      });

      it('should generate TenantDatabaseUpdatedEvent when updating readDatabaseName with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newName = new TenantDatabaseNameValueObject(
          'tenant_db_read_updated',
        );

        aggregate.update({ readDatabaseName: newName }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(TenantDatabaseUpdatedEvent);
        const event = events[0] as TenantDatabaseUpdatedEvent;
        expect(event.data.readDatabaseName).toBe('tenant_db_read_updated');
      });
    });

    describe('status field', () => {
      it('should update status when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalStatus = aggregate.status.value;
        const newStatus = new TenantDatabaseStatusValueObject(
          TenantDatabaseStatusEnum.MIGRATING,
        );

        aggregate.update({ status: newStatus }, false);

        expect(aggregate.status.value).toBe(TenantDatabaseStatusEnum.MIGRATING);
        expect(aggregate.status.value).not.toBe(originalStatus);
      });

      it('should keep original status when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalStatus = aggregate.status.value;

        aggregate.update({ status: undefined }, false);

        expect(aggregate.status.value).toBe(originalStatus);
      });

      it('should generate TenantDatabaseUpdatedEvent when updating status with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newStatus = new TenantDatabaseStatusValueObject(
          TenantDatabaseStatusEnum.FAILED,
        );

        aggregate.update({ status: newStatus }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as TenantDatabaseUpdatedEvent;
        expect(event.data.status).toBe(TenantDatabaseStatusEnum.FAILED);
      });
    });

    describe('schemaVersion field', () => {
      it('should update schemaVersion when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalVersion = aggregate.schemaVersion?.value;
        const newVersion = new TenantDatabaseSchemaVersionValueObject('2.0.0');

        aggregate.update({ schemaVersion: newVersion }, false);

        expect(aggregate.schemaVersion?.value).toBe('2.0.0');
        expect(aggregate.schemaVersion?.value).not.toBe(originalVersion);
      });

      it('should update schemaVersion to null when null is provided', () => {
        const aggregate = createBaseAggregate();

        aggregate.update({ schemaVersion: null }, false);

        expect(aggregate.schemaVersion).toBeNull();
      });

      it('should keep original schemaVersion when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalVersion = aggregate.schemaVersion?.value;

        aggregate.update({ schemaVersion: undefined }, false);

        expect(aggregate.schemaVersion?.value).toBe(originalVersion);
      });

      it('should generate TenantDatabaseUpdatedEvent when updating schemaVersion with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newVersion = new TenantDatabaseSchemaVersionValueObject('2.0.0');

        aggregate.update({ schemaVersion: newVersion }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as TenantDatabaseUpdatedEvent;
        expect(event.data.schemaVersion).toBe('2.0.0');
      });
    });

    describe('lastMigrationAt field', () => {
      it('should update lastMigrationAt when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalDate = aggregate.lastMigrationAt?.value;
        const newDate = new TenantDatabaseLastMigrationAtValueObject(
          new Date('2024-02-01T10:00:00Z'),
        );

        aggregate.update({ lastMigrationAt: newDate }, false);

        expect(aggregate.lastMigrationAt?.value).toEqual(
          new Date('2024-02-01T10:00:00Z'),
        );
        expect(aggregate.lastMigrationAt?.value).not.toEqual(originalDate);
      });

      it('should update lastMigrationAt to null when null is provided', () => {
        const aggregate = createBaseAggregate();

        aggregate.update({ lastMigrationAt: null }, false);

        expect(aggregate.lastMigrationAt).toBeNull();
      });

      it('should keep original lastMigrationAt when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalDate = aggregate.lastMigrationAt?.value;

        aggregate.update({ lastMigrationAt: undefined }, false);

        expect(aggregate.lastMigrationAt?.value).toEqual(originalDate);
      });

      it('should generate TenantDatabaseUpdatedEvent when updating lastMigrationAt with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newDate = new TenantDatabaseLastMigrationAtValueObject(
          new Date('2024-02-01T10:00:00Z'),
        );

        aggregate.update({ lastMigrationAt: newDate }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as TenantDatabaseUpdatedEvent;
        expect(event.data.lastMigrationAt).toEqual(
          new Date('2024-02-01T10:00:00Z'),
        );
      });
    });

    describe('errorMessage field', () => {
      it('should update errorMessage when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const newErrorMessage = new TenantDatabaseErrorMessageValueObject(
          'Migration failed',
        );

        aggregate.update({ errorMessage: newErrorMessage }, false);

        expect(aggregate.errorMessage?.value).toBe('Migration failed');
      });

      it('should update errorMessage to null when null is provided', () => {
        const aggregate = createBaseAggregate();
        const errorMessage = new TenantDatabaseErrorMessageValueObject(
          'Some error',
        );
        aggregate.update({ errorMessage }, false);

        aggregate.update({ errorMessage: null }, false);

        expect(aggregate.errorMessage).toBeNull();
      });

      it('should keep original errorMessage when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalErrorMessage = aggregate.errorMessage;

        aggregate.update({ errorMessage: undefined }, false);

        expect(aggregate.errorMessage).toBe(originalErrorMessage);
      });

      it('should generate TenantDatabaseUpdatedEvent when updating errorMessage with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newErrorMessage = new TenantDatabaseErrorMessageValueObject(
          'Connection timeout',
        );

        aggregate.update({ errorMessage: newErrorMessage }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as TenantDatabaseUpdatedEvent;
        expect(event.data.errorMessage).toBe('Connection timeout');
      });
    });

    describe('multiple fields update', () => {
      it('should update multiple fields at once', () => {
        const aggregate = createBaseAggregate();
        const updateDto: ITenantDatabaseUpdateDto = {
          databaseName: new TenantDatabaseNameValueObject('tenant_db_new'),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.SUSPENDED,
          ),
          schemaVersion: new TenantDatabaseSchemaVersionValueObject('3.0.0'),
        };

        aggregate.update(updateDto, false);

        expect(aggregate.databaseName.value).toBe('tenant_db_new');
        expect(aggregate.status.value).toBe(TenantDatabaseStatusEnum.SUSPENDED);
        expect(aggregate.schemaVersion?.value).toBe('3.0.0');
      });

      it('should update updatedAt timestamp when any field is updated', () => {
        const aggregate = createBaseAggregate();
        const originalUpdatedAt = aggregate.updatedAt.value;
        // Wait a bit to ensure different timestamp
        const beforeUpdate = new Date();
        // Small delay to ensure timestamp difference
        while (new Date().getTime() === beforeUpdate.getTime()) {
          // Wait for next millisecond
        }

        aggregate.update(
          {
            databaseName: new TenantDatabaseNameValueObject('tenant_db_new'),
          },
          false,
        );

        expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });
    });
  });

  describe('delete', () => {
    it('should generate TenantDatabaseDeletedEvent by default', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete();

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantDatabaseDeletedEvent);

      const event = events[0] as TenantDatabaseDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(TenantDatabaseAggregate.name);
      expect(event.eventType).toBe(TenantDatabaseDeletedEvent.name);
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.delete(false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.id).toBeInstanceOf(TenantDatabaseUuidValueObject);
    });

    it('should return correct tenantId', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.tenantId.value).toBe(
        '223e4567-e89b-12d3-a456-426614174001',
      );
      expect(aggregate.tenantId).toBeInstanceOf(TenantUuidValueObject);
    });

    it('should return correct databaseName', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.databaseName.value).toBe('tenant_db_original');
      expect(aggregate.databaseName).toBeInstanceOf(
        TenantDatabaseNameValueObject,
      );
    });

    it('should return correct readDatabaseName', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.readDatabaseName.value).toBe('tenant_db_read_original');
      expect(aggregate.readDatabaseName).toBeInstanceOf(
        TenantDatabaseNameValueObject,
      );
    });

    it('should return correct status', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.status.value).toBe(TenantDatabaseStatusEnum.ACTIVE);
      expect(aggregate.status).toBeInstanceOf(TenantDatabaseStatusValueObject);
    });

    it('should return correct schemaVersion', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.schemaVersion?.value).toBe('1.0.0');
      expect(aggregate.schemaVersion).toBeInstanceOf(
        TenantDatabaseSchemaVersionValueObject,
      );
    });

    it('should return correct lastMigrationAt', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.lastMigrationAt?.value).toEqual(
        new Date('2024-01-01T10:00:00Z'),
      );
      expect(aggregate.lastMigrationAt).toBeInstanceOf(
        TenantDatabaseLastMigrationAtValueObject,
      );
    });

    it('should return correct errorMessage', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.errorMessage).toBeNull();
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives correctly', () => {
      const aggregate = createBaseAggregate();
      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_original',
        readDatabaseName: 'tenant_db_read_original',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: aggregate.createdAt.value,
        updatedAt: aggregate.updatedAt.value,
      });
    });

    it('should convert aggregate with null optional fields to primitives correctly', () => {
      const dto: ITenantDatabaseCreateDto = {
        id: new TenantDatabaseUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        databaseName: new TenantDatabaseNameValueObject('tenant_db'),
        readDatabaseName: new TenantDatabaseNameValueObject('tenant_db_read'),
        status: new TenantDatabaseStatusValueObject(
          TenantDatabaseStatusEnum.PROVISIONING,
        ),
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      };

      const aggregate = new TenantDatabaseAggregate(dto, false);
      const primitives = aggregate.toPrimitives();

      expect(primitives.schemaVersion).toBeNull();
      expect(primitives.lastMigrationAt).toBeNull();
      expect(primitives.errorMessage).toBeNull();
    });
  });
});
