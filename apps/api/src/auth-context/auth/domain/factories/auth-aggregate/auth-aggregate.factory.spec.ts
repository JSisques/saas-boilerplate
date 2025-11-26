import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { IAuthCreateDto } from '@/auth-context/auth/domain/dtos/entities/auth-create/auth-create.dto';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthPrimitives } from '@/auth-context/auth/domain/primitives/auth.primitives';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthCreatedEvent } from '@/shared/domain/events/auth/auth-created/auth-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AuthAggregateFactory', () => {
  let factory: AuthAggregateFactory;

  beforeEach(() => {
    factory = new AuthAggregateFactory();
  });

  describe('create', () => {
    it('should create an AuthAggregate from DTO with all fields and generate event by default', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const dto: IAuthCreateDto = {
        id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        userId: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174001'),
        email: new AuthEmailValueObject('test@example.com'),
        emailVerified: new AuthEmailVerifiedValueObject(false),
        lastLoginAt: new AuthLastLoginAtValueObject(
          new Date('2024-01-01T09:00:00Z'),
        ),
        password: new AuthPasswordValueObject('SecurePass123!'),
        phoneNumber: new AuthPhoneNumberValueObject('+1234567890'),
        provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
        providerId: new AuthProviderIdValueObject('local-123'),
        twoFactorEnabled: new AuthTwoFactorEnabledValueObject(true),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(AuthAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.userId.value).toBe(dto.userId.value);
      expect(aggregate.email?.value).toBe(dto.email?.value);
      expect(aggregate.emailVerified.value).toBe(dto.emailVerified.value);
      expect(aggregate.lastLoginAt?.value).toEqual(dto.lastLoginAt?.value);
      expect(aggregate.password?.value).toBe(dto.password?.value);
      expect(aggregate.phoneNumber?.value).toBe(dto.phoneNumber?.value);
      expect(aggregate.provider.value).toBe(dto.provider.value);
      expect(aggregate.providerId?.value).toBe(dto.providerId?.value);
      expect(aggregate.twoFactorEnabled.value).toBe(dto.twoFactorEnabled.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(AuthCreatedEvent);
    });

    it('should create an AuthAggregate from DTO without generating event when generateEvent is false', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const dto: IAuthCreateDto = {
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
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(AuthAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.userId.value).toBe(dto.userId.value);
      expect(aggregate.email?.value).toBe(dto.email?.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create an AuthAggregate from DTO with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const dto: IAuthCreateDto = {
        id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        userId: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174001'),
        email: null,
        emailVerified: new AuthEmailVerifiedValueObject(false),
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: new AuthProviderValueObject(AuthProviderEnum.GOOGLE),
        providerId: new AuthProviderIdValueObject('google-123'),
        twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(AuthAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.userId.value).toBe(dto.userId.value);
      expect(aggregate.email).toBeNull();
      expect(aggregate.lastLoginAt).toBeNull();
      expect(aggregate.password).toBeNull();
      expect(aggregate.phoneNumber).toBeNull();
      expect(aggregate.provider.value).toBe(dto.provider.value);
      expect(aggregate.providerId?.value).toBe(dto.providerId?.value);
    });
  });

  describe('fromPrimitives', () => {
    it('should create an AuthAggregate from primitives with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const lastLoginAt = new Date('2024-01-01T09:00:00Z');

      const primitives: AuthPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: lastLoginAt,
        password: 'SecurePass123!',
        phoneNumber: '+1234567890',
        provider: AuthProviderEnum.LOCAL,
        providerId: 'local-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(AuthAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.userId.value).toBe(primitives.userId);
      expect(aggregate.email?.value).toBe(primitives.email);
      expect(aggregate.emailVerified.value).toBe(primitives.emailVerified);
      expect(aggregate.lastLoginAt?.value).toEqual(primitives.lastLoginAt);
      expect(aggregate.password?.value).toBe(primitives.password);
      expect(aggregate.phoneNumber?.value).toBe(primitives.phoneNumber);
      expect(aggregate.provider.value).toBe(primitives.provider);
      expect(aggregate.providerId?.value).toBe(primitives.providerId);
      expect(aggregate.twoFactorEnabled.value).toBe(
        primitives.twoFactorEnabled,
      );
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create an AuthAggregate from primitives with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const primitives: AuthPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: null,
        emailVerified: false,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(AuthAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.userId.value).toBe(primitives.userId);
      expect(aggregate.email).toBeNull();
      expect(aggregate.lastLoginAt).toBeNull();
      expect(aggregate.password).toBeNull();
      expect(aggregate.phoneNumber).toBeNull();
      expect(aggregate.provider.value).toBe(primitives.provider);
      expect(aggregate.providerId?.value).toBe(primitives.providerId);
      expect(aggregate.emailVerified.value).toBe(primitives.emailVerified);
      expect(aggregate.twoFactorEnabled.value).toBe(
        primitives.twoFactorEnabled,
      );
    });

    it('should create an AuthAggregate from primitives with null providerId', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const primitives: AuthPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        emailVerified: false,
        lastLoginAt: null,
        password: 'SecurePass123!',
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(AuthAggregate);
      expect(aggregate.providerId).toBeNull();
    });

    it('should handle false boolean values correctly in fromPrimitives', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const primitives: AuthPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        emailVerified: false,
        lastLoginAt: null,
        password: 'SecurePass123!',
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.emailVerified.value).toBe(false);
      expect(aggregate.twoFactorEnabled.value).toBe(false);
    });

    it('should handle different provider types correctly', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const providers = [
        AuthProviderEnum.LOCAL,
        AuthProviderEnum.GOOGLE,
        AuthProviderEnum.APPLE,
      ];

      providers.forEach((provider) => {
        const primitives: AuthPrimitives = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          email: 'test@example.com',
          emailVerified: false,
          lastLoginAt: null,
          password:
            provider === AuthProviderEnum.LOCAL ? 'SecurePass123!' : null,
          phoneNumber: null,
          provider: provider,
          providerId:
            provider !== AuthProviderEnum.LOCAL ? `${provider}-123` : null,
          twoFactorEnabled: false,
          createdAt: now,
          updatedAt: now,
        };

        const aggregate = factory.fromPrimitives(primitives);

        expect(aggregate.provider.value).toBe(provider);
      });
    });
  });
});
