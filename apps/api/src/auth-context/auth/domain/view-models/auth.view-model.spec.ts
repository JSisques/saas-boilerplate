import { IAuthCreateViewModelDto } from '@/auth-context/auth/domain/dtos/view-models/auth-create/auth-create-view-model.dto';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';

describe('AuthViewModel', () => {
  const createBaseViewModel = (): AuthViewModel => {
    return new AuthViewModel({
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
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z'),
    });
  };

  describe('constructor', () => {
    it('should create an AuthViewModel with all properties', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const lastLoginAt = new Date('2024-01-01T09:00:00Z');

      const dto: IAuthCreateViewModelDto = {
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

      const viewModel = new AuthViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.userId).toBe(dto.userId);
      expect(viewModel.email).toBe(dto.email);
      expect(viewModel.emailVerified).toBe(dto.emailVerified);
      expect(viewModel.lastLoginAt).toEqual(dto.lastLoginAt);
      expect(viewModel.password).toBe(dto.password);
      expect(viewModel.phoneNumber).toBe(dto.phoneNumber);
      expect(viewModel.provider).toBe(dto.provider);
      expect(viewModel.providerId).toBe(dto.providerId);
      expect(viewModel.twoFactorEnabled).toBe(dto.twoFactorEnabled);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create an AuthViewModel with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const dto: IAuthCreateViewModelDto = {
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

      const viewModel = new AuthViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.userId).toBe(dto.userId);
      expect(viewModel.email).toBeNull();
      expect(viewModel.lastLoginAt).toBeNull();
      expect(viewModel.password).toBeNull();
      expect(viewModel.phoneNumber).toBeNull();
      expect(viewModel.provider).toBe(dto.provider);
      expect(viewModel.providerId).toBe(dto.providerId);
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should expose userId via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.userId).toBe('123e4567-e89b-12d3-a456-426614174001');
    });

    it('should expose email via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.email).toBe('test@example.com');
    });

    it('should expose emailVerified via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.emailVerified).toBe(false);
    });

    it('should expose phoneNumber via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.phoneNumber).toBeNull();
    });

    it('should expose lastLoginAt via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.lastLoginAt).toBeNull();
    });

    it('should expose password via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.password).toBe('SecurePass123!');
    });

    it('should expose provider via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.provider).toBe(AuthProviderEnum.LOCAL);
    });

    it('should expose providerId via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.providerId).toBeNull();
    });

    it('should expose twoFactorEnabled via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.twoFactorEnabled).toBe(false);
    });

    it('should expose createdAt via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'));
    });

    it('should expose updatedAt via getter', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.updatedAt).toEqual(new Date('2024-01-01T10:00:00Z'));
    });
  });

  describe('update', () => {
    describe('email field', () => {
      it('should update email when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalEmail = viewModel.email;

        viewModel.update({ email: 'updated@example.com' });

        expect(viewModel.email).toBe('updated@example.com');
        expect(viewModel.email).not.toBe(originalEmail);
      });

      it('should keep original email when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalEmail = viewModel.email;

        viewModel.update({ email: undefined });

        expect(viewModel.email).toBe(originalEmail);
      });

      it('should allow setting email to null', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({ email: null });

        expect(viewModel.email).toBeNull();
      });
    });

    describe('emailVerified field', () => {
      it('should update emailVerified when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalEmailVerified = viewModel.emailVerified;

        viewModel.update({ emailVerified: true });

        expect(viewModel.emailVerified).toBe(true);
        expect(viewModel.emailVerified).not.toBe(originalEmailVerified);
      });

      it('should keep original emailVerified when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalEmailVerified = viewModel.emailVerified;

        viewModel.update({ emailVerified: undefined });

        expect(viewModel.emailVerified).toBe(originalEmailVerified);
      });
    });

    describe('lastLoginAt field', () => {
      it('should update lastLoginAt when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const newLastLoginAt = new Date('2024-01-02T10:00:00Z');

        viewModel.update({ lastLoginAt: newLastLoginAt });

        expect(viewModel.lastLoginAt).toEqual(newLastLoginAt);
      });

      it('should keep original lastLoginAt when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalLastLoginAt = viewModel.lastLoginAt;

        viewModel.update({ lastLoginAt: undefined });

        expect(viewModel.lastLoginAt).toBe(originalLastLoginAt);
      });

      it('should allow setting lastLoginAt to null', () => {
        const viewModel = new AuthViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          email: 'test@example.com',
          emailVerified: false,
          lastLoginAt: new Date('2024-01-01T09:00:00Z'),
          password: 'SecurePass123!',
          phoneNumber: null,
          provider: AuthProviderEnum.LOCAL,
          providerId: null,
          twoFactorEnabled: false,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        });

        viewModel.update({ lastLoginAt: null });

        expect(viewModel.lastLoginAt).toBeNull();
      });
    });

    describe('password field', () => {
      it('should update password when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPassword = viewModel.password;

        viewModel.update({ password: 'NewSecurePass123!' });

        expect(viewModel.password).toBe('NewSecurePass123!');
        expect(viewModel.password).not.toBe(originalPassword);
      });

      it('should keep original password when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPassword = viewModel.password;

        viewModel.update({ password: undefined });

        expect(viewModel.password).toBe(originalPassword);
      });

      it('should allow setting password to null', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({ password: null });

        expect(viewModel.password).toBeNull();
      });
    });

    describe('provider field', () => {
      it('should update provider when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalProvider = viewModel.provider;

        viewModel.update({ provider: AuthProviderEnum.GOOGLE });

        expect(viewModel.provider).toBe(AuthProviderEnum.GOOGLE);
        expect(viewModel.provider).not.toBe(originalProvider);
      });

      it('should keep original provider when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalProvider = viewModel.provider;

        viewModel.update({ provider: undefined });

        expect(viewModel.provider).toBe(originalProvider);
      });
    });

    describe('providerId field', () => {
      it('should update providerId when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalProviderId = viewModel.providerId;

        viewModel.update({ providerId: 'google-123' });

        expect(viewModel.providerId).toBe('google-123');
        expect(viewModel.providerId).not.toBe(originalProviderId);
      });

      it('should keep original providerId when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalProviderId = viewModel.providerId;

        viewModel.update({ providerId: undefined });

        expect(viewModel.providerId).toBe(originalProviderId);
      });

      it('should allow setting providerId to null', () => {
        const viewModel = new AuthViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          email: 'test@example.com',
          emailVerified: false,
          lastLoginAt: null,
          password: 'SecurePass123!',
          phoneNumber: null,
          provider: AuthProviderEnum.LOCAL,
          providerId: 'local-123',
          twoFactorEnabled: false,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        });

        viewModel.update({ providerId: null });

        expect(viewModel.providerId).toBeNull();
      });
    });

    describe('twoFactorEnabled field', () => {
      it('should update twoFactorEnabled when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalTwoFactorEnabled = viewModel.twoFactorEnabled;

        viewModel.update({ twoFactorEnabled: true });

        expect(viewModel.twoFactorEnabled).toBe(true);
        expect(viewModel.twoFactorEnabled).not.toBe(originalTwoFactorEnabled);
      });

      it('should keep original twoFactorEnabled when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalTwoFactorEnabled = viewModel.twoFactorEnabled;

        viewModel.update({ twoFactorEnabled: undefined });

        expect(viewModel.twoFactorEnabled).toBe(originalTwoFactorEnabled);
      });
    });

    describe('phoneNumber field', () => {
      it('should update phoneNumber when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPhoneNumber = viewModel.phoneNumber;

        viewModel.update({ phoneNumber: '+9876543210' });

        expect(viewModel.phoneNumber).toBe('+9876543210');
        expect(viewModel.phoneNumber).not.toBe(originalPhoneNumber);
      });

      it('should keep original phoneNumber when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPhoneNumber = viewModel.phoneNumber;

        viewModel.update({ phoneNumber: undefined });

        expect(viewModel.phoneNumber).toBe(originalPhoneNumber);
      });

      it('should allow setting phoneNumber to null', () => {
        const viewModel = new AuthViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          email: 'test@example.com',
          emailVerified: false,
          lastLoginAt: null,
          password: 'SecurePass123!',
          phoneNumber: '+1234567890',
          provider: AuthProviderEnum.LOCAL,
          providerId: null,
          twoFactorEnabled: false,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        });

        viewModel.update({ phoneNumber: null });

        expect(viewModel.phoneNumber).toBeNull();
      });
    });

    it('should update multiple fields at once', () => {
      const viewModel = createBaseViewModel();
      const newEmail = 'updated@example.com';
      const newEmailVerified = true;

      viewModel.update({
        email: newEmail,
        emailVerified: newEmailVerified,
      });

      expect(viewModel.email).toBe(newEmail);
      expect(viewModel.emailVerified).toBe(newEmailVerified);
    });

    it('should update updatedAt timestamp when updating', () => {
      const viewModel = createBaseViewModel();
      const originalUpdatedAt = viewModel.updatedAt;
      const beforeUpdate = new Date();

      viewModel.update({ email: 'new@example.com' });

      const afterUpdate = new Date();
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });
  });
});
