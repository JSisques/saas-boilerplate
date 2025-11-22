import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { IAuthCreateDto } from '@/auth-context/auth/domain/dtos/entities/auth-create/auth-create.dto';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthCreatedEvent } from '@/shared/domain/events/auth/auth-created/auth-created.event';
import { AuthDeletedEvent } from '@/shared/domain/events/auth/auth-deleted/auth-deleted.event';
import { AuthUpdatedLastLoginAtEvent } from '@/shared/domain/events/auth/auth-updated-last-login-at/auth-updated-last-login-at.event';
import { AuthUpdatedEvent } from '@/shared/domain/events/auth/auth-updated/auth-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AuthAggregate', () => {
  const createAuthDto = (
    overrides?: Partial<IAuthCreateDto>,
  ): IAuthCreateDto => {
    const now = new Date('2024-01-01T10:00:00Z');
    return {
      id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      userId: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174001'),
      email: new AuthEmailValueObject('test@example.com'),
      emailVerified: new AuthEmailVerifiedValueObject(false),
      lastLoginAt: null,
      password: new AuthPasswordValueObject('SecurePass123!'),
      phoneNumber: null,
      provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
      providerId: null,
      twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
      ...overrides,
    };
  };

  describe('constructor', () => {
    it('should create an AuthAggregate with all properties', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.userId.value).toBe(dto.userId.value);
      expect(aggregate.email?.value).toBe(dto.email?.value);
      expect(aggregate.emailVerified.value).toBe(dto.emailVerified.value);
      expect(aggregate.password?.value).toBe(dto.password?.value);
      expect(aggregate.provider.value).toBe(dto.provider.value);
      expect(aggregate.twoFactorEnabled.value).toBe(dto.twoFactorEnabled.value);
    });

    it('should emit AuthCreatedEvent on creation by default', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AuthCreatedEvent);

      const event = events[0] as AuthCreatedEvent;
      expect(event.aggregateId).toBe(dto.id.value);
      expect(event.aggregateType).toBe(AuthAggregate.name);
      expect(event.eventType).toBe(AuthCreatedEvent.name);
      expect(event.data.id).toBe(dto.id.value);
      expect(event.data.userId).toBe(dto.userId.value);
    });

    it('should not emit AuthCreatedEvent when generateEvent is false', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should handle null optional fields correctly', () => {
      const dto = createAuthDto({
        email: null,
        phoneNumber: null,
        password: null,
        providerId: null,
        lastLoginAt: null,
      });
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.email).toBeNull();
      expect(aggregate.phoneNumber).toBeNull();
      expect(aggregate.password).toBeNull();
      expect(aggregate.providerId).toBeNull();
      expect(aggregate.lastLoginAt).toBeNull();
    });
  });

  describe('getters', () => {
    it('should expose id value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.id).toBeInstanceOf(AuthUuidValueObject);
      expect(aggregate.id.value).toBe(dto.id.value);
    });

    it('should expose userId value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.userId).toBeInstanceOf(UserUuidValueObject);
      expect(aggregate.userId.value).toBe(dto.userId.value);
    });

    it('should expose email value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.email).toBeInstanceOf(AuthEmailValueObject);
      expect(aggregate.email?.value).toBe(dto.email?.value);
    });

    it('should expose emailVerified value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.emailVerified).toBeInstanceOf(
        AuthEmailVerifiedValueObject,
      );
      expect(aggregate.emailVerified.value).toBe(dto.emailVerified.value);
    });

    it('should expose password value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.password).toBeInstanceOf(AuthPasswordValueObject);
      expect(aggregate.password?.value).toBe(dto.password?.value);
    });

    it('should expose provider value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.provider).toBeInstanceOf(AuthProviderValueObject);
      expect(aggregate.provider.value).toBe(dto.provider.value);
    });

    it('should expose twoFactorEnabled value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.twoFactorEnabled).toBeInstanceOf(
        AuthTwoFactorEnabledValueObject,
      );
      expect(aggregate.twoFactorEnabled.value).toBe(dto.twoFactorEnabled.value);
    });

    it('should expose createdAt value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.createdAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
    });

    it('should expose updatedAt value object via getter', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      expect(aggregate.updatedAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);
    });
  });

  describe('update', () => {
    it('should update email when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newEmail = new AuthEmailValueObject('newemail@example.com');

      aggregate.update({ email: newEmail }, false);

      expect(aggregate.email?.value).toBe('newemail@example.com');
    });

    it('should keep original email when undefined is provided', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);
      const originalEmail = aggregate.email?.value;

      aggregate.update({ email: undefined }, false);

      expect(aggregate.email?.value).toBe(originalEmail);
    });

    it('should update emailVerified when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newEmailVerified = new AuthEmailVerifiedValueObject(true);

      aggregate.update({ emailVerified: newEmailVerified }, false);

      expect(aggregate.emailVerified.value).toBe(true);
    });

    it('should update password when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newPassword = new AuthPasswordValueObject('NewSecurePass123!');

      aggregate.update({ password: newPassword }, false);

      expect(aggregate.password?.value).toBe('NewSecurePass123!');
    });

    it('should update provider when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newProvider = new AuthProviderValueObject(AuthProviderEnum.GOOGLE);

      aggregate.update({ provider: newProvider }, false);

      expect(aggregate.provider.value).toBe(AuthProviderEnum.GOOGLE);
    });

    it('should update providerId when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newProviderId = new AuthProviderIdValueObject('google-123');

      aggregate.update({ providerId: newProviderId }, false);

      expect(aggregate.providerId?.value).toBe('google-123');
    });

    it('should update twoFactorEnabled when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newTwoFactorEnabled = new AuthTwoFactorEnabledValueObject(true);

      aggregate.update({ twoFactorEnabled: newTwoFactorEnabled }, false);

      expect(aggregate.twoFactorEnabled.value).toBe(true);
    });

    it('should update phoneNumber when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newPhoneNumber = new AuthPhoneNumberValueObject('+1234567890');

      aggregate.update({ phoneNumber: newPhoneNumber }, false);

      expect(aggregate.phoneNumber?.value).toBe('+1234567890');
    });

    it('should update lastLoginAt when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newLastLoginAt = new AuthLastLoginAtValueObject(
        new Date('2024-01-02T10:00:00Z'),
      );

      aggregate.update({ lastLoginAt: newLastLoginAt }, false);

      expect(aggregate.lastLoginAt?.value).toEqual(
        new Date('2024-01-02T10:00:00Z'),
      );
    });

    it('should update multiple fields at once', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newEmail = new AuthEmailValueObject('updated@example.com');
      const newEmailVerified = new AuthEmailVerifiedValueObject(true);

      aggregate.update(
        { email: newEmail, emailVerified: newEmailVerified },
        false,
      );

      expect(aggregate.email?.value).toBe('updated@example.com');
      expect(aggregate.emailVerified.value).toBe(true);
    });

    it('should update updatedAt timestamp when updating', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const originalUpdatedAt = aggregate.updatedAt.value;
      const beforeUpdate = new Date();

      aggregate.update(
        { email: new AuthEmailValueObject('new@example.com') },
        false,
      );

      const afterUpdate = new Date();
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate AuthUpdatedEvent when updating with generateEvent true', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      aggregate.commit(); // Clear creation event
      const newEmail = new AuthEmailValueObject('updated@example.com');

      aggregate.update({ email: newEmail }, true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AuthUpdatedEvent);

      const event = events[0] as AuthUpdatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(AuthAggregate.name);
      expect(event.eventType).toBe(AuthUpdatedEvent.name);
      expect(event.data.email).toBe('updated@example.com');
    });

    it('should not generate AuthUpdatedEvent when generateEvent is false', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      aggregate.commit();
      const newEmail = new AuthEmailValueObject('updated@example.com');

      aggregate.update({ email: newEmail }, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('updateLastLoginAt', () => {
    it('should update lastLoginAt when new value is provided', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      const newLastLoginAt = new AuthLastLoginAtValueObject(
        new Date('2024-01-02T10:00:00Z'),
      );

      aggregate.updateLastLoginAt(newLastLoginAt, false);

      expect(aggregate.lastLoginAt?.value).toEqual(
        new Date('2024-01-02T10:00:00Z'),
      );
    });

    it('should generate AuthUpdatedLastLoginAtEvent when updating with generateEvent true', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      aggregate.commit();
      const newLastLoginAt = new AuthLastLoginAtValueObject(
        new Date('2024-01-02T10:00:00Z'),
      );

      aggregate.updateLastLoginAt(newLastLoginAt, true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AuthUpdatedLastLoginAtEvent);

      const event = events[0] as AuthUpdatedLastLoginAtEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(AuthAggregate.name);
      expect(event.eventType).toBe(AuthUpdatedLastLoginAtEvent.name);
      expect(event.data.lastLoginAt).toEqual(new Date('2024-01-02T10:00:00Z'));
    });

    it('should not generate AuthUpdatedLastLoginAtEvent when generateEvent is false', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      aggregate.commit();
      const newLastLoginAt = new AuthLastLoginAtValueObject(
        new Date('2024-01-02T10:00:00Z'),
      );

      aggregate.updateLastLoginAt(newLastLoginAt, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should generate AuthDeletedEvent when deleting with generateEvent true', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      aggregate.commit();

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AuthDeletedEvent);

      const event = events[0] as AuthDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(AuthAggregate.name);
      expect(event.eventType).toBe(AuthDeletedEvent.name);
      expect(event.data.id).toBe(aggregate.id.value);
    });

    it('should not generate AuthDeletedEvent when generateEvent is false', () => {
      const aggregate = new AuthAggregate(createAuthDto(), false);
      aggregate.commit();

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives correctly', () => {
      const dto = createAuthDto();
      const aggregate = new AuthAggregate(dto, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.id).toBe(dto.id.value);
      expect(primitives.userId).toBe(dto.userId.value);
      expect(primitives.email).toBe(dto.email?.value);
      expect(primitives.emailVerified).toBe(dto.emailVerified.value);
      expect(primitives.password).toBe(dto.password?.value);
      expect(primitives.provider).toBe(dto.provider.value);
      expect(primitives.twoFactorEnabled).toBe(dto.twoFactorEnabled.value);
      expect(primitives.createdAt).toEqual(dto.createdAt.value);
      expect(primitives.updatedAt).toEqual(dto.updatedAt.value);
    });

    it('should convert aggregate with null optional fields to primitives correctly', () => {
      const dto = createAuthDto({
        email: null,
        phoneNumber: null,
        password: null,
        providerId: null,
        lastLoginAt: null,
      });
      const aggregate = new AuthAggregate(dto, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.email).toBeNull();
      expect(primitives.phoneNumber).toBeNull();
      expect(primitives.password).toBeNull();
      expect(primitives.providerId).toBeNull();
      expect(primitives.lastLoginAt).toBeNull();
    });
  });
});
