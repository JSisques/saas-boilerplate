import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { ITenantCreateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-create/tenant-create-view-model.dto';
import { ITenantUpdateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-update/tenant-update-view-model.dto';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';

describe('TenantViewModel', () => {
  const createBaseViewModel = (): TenantViewModel => {
    const dto: ITenantCreateViewModelDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Tenant',
      slug: 'test-tenant',
      description: 'Test description',
      websiteUrl: 'https://example.com',
      logoUrl: 'https://example.com/logo.png',
      faviconUrl: 'https://example.com/favicon.ico',
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      status: TenantStatusEnum.ACTIVE,
      email: 'test@example.com',
      phoneNumber: '1234567890',
      phoneCode: '+1',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      timezone: 'America/New_York',
      locale: 'en-US',
      maxUsers: 100,
      maxStorage: 1000,
      maxApiCalls: 10000,
      tenantMembers: [],
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    return new TenantViewModel(dto);
  };

  describe('constructor', () => {
    it('should create a TenantViewModel with all fields', () => {
      const viewModel = createBaseViewModel();

      expect(viewModel).toBeInstanceOf(TenantViewModel);
      expect(viewModel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(viewModel.name).toBe('Test Tenant');
      expect(viewModel.slug).toBe('test-tenant');
      expect(viewModel.description).toBe('Test description');
      expect(viewModel.status).toBe(TenantStatusEnum.ACTIVE);
      expect(viewModel.email).toBe('test@example.com');
      expect(viewModel.maxUsers).toBe(100);
    });

    it('should create a TenantViewModel with null optional fields', () => {
      const dto: ITenantCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const viewModel = new TenantViewModel(dto);

      expect(viewModel.description).toBeNull();
      expect(viewModel.email).toBeNull();
      expect(viewModel.maxUsers).toBeNull();
    });

    it('should use current date when createdAt is not provided', () => {
      const dto: ITenantCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
      };

      const viewModel = new TenantViewModel(dto);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    it('should update name when new value is provided', () => {
      const viewModel = createBaseViewModel();
      const originalName = viewModel.name;
      const updateDto: ITenantUpdateViewModelDto = {
        name: 'Updated Tenant',
      };

      viewModel.update(updateDto);

      expect(viewModel.name).toBe('Updated Tenant');
      expect(viewModel.name).not.toBe(originalName);
    });

    it('should update slug when new value is provided', () => {
      const viewModel = createBaseViewModel();
      const updateDto: ITenantUpdateViewModelDto = {
        slug: 'updated-tenant',
      };

      viewModel.update(updateDto);

      expect(viewModel.slug).toBe('updated-tenant');
    });

    it('should update status when new value is provided', () => {
      const viewModel = createBaseViewModel();
      const updateDto: ITenantUpdateViewModelDto = {
        status: TenantStatusEnum.INACTIVE,
      };

      viewModel.update(updateDto);

      expect(viewModel.status).toBe(TenantStatusEnum.INACTIVE);
    });

    it('should update optional fields when new values are provided', () => {
      const viewModel = createBaseViewModel();
      const updateDto: ITenantUpdateViewModelDto = {
        description: 'Updated description',
        email: 'updated@example.com',
        maxUsers: 200,
      };

      viewModel.update(updateDto);

      expect(viewModel.description).toBe('Updated description');
      expect(viewModel.email).toBe('updated@example.com');
      expect(viewModel.maxUsers).toBe(200);
    });

    it('should not update fields when undefined is provided', () => {
      const viewModel = createBaseViewModel();
      const originalName = viewModel.name;
      const originalSlug = viewModel.slug;

      viewModel.update({});

      expect(viewModel.name).toBe(originalName);
      expect(viewModel.slug).toBe(originalSlug);
    });

    it('should update multiple fields at once', () => {
      const viewModel = createBaseViewModel();
      const updateDto: ITenantUpdateViewModelDto = {
        name: 'Updated Tenant',
        status: TenantStatusEnum.BLOCKED,
        email: 'newemail@example.com',
        maxUsers: 500,
      };

      viewModel.update(updateDto);

      expect(viewModel.name).toBe('Updated Tenant');
      expect(viewModel.status).toBe(TenantStatusEnum.BLOCKED);
      expect(viewModel.email).toBe('newemail@example.com');
      expect(viewModel.maxUsers).toBe(500);
    });

    it('should update updatedAt timestamp when any field is updated', () => {
      const viewModel = createBaseViewModel();
      const originalUpdatedAt = viewModel.updatedAt;
      // Small delay to ensure timestamp difference
      const beforeUpdate = new Date();
      while (new Date().getTime() === beforeUpdate.getTime()) {
        // Wait for next millisecond
      }

      viewModel.update({
        name: 'Updated Tenant',
      });

      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return correct name', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.name).toBe('Test Tenant');
    });

    it('should return correct slug', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.slug).toBe('test-tenant');
    });

    it('should return correct status', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.status).toBe(TenantStatusEnum.ACTIVE);
    });

    it('should return correct email', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.email).toBe('test@example.com');
    });

    it('should return correct maxUsers', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.maxUsers).toBe(100);
    });

    it('should return correct tenantMembers', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.tenantMembers).toEqual([]);
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
