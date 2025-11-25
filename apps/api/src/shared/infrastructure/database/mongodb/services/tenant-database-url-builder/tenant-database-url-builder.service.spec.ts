import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TenantDatabaseUrlBuilderService } from './tenant-database-url-builder.service';

describe('TenantDatabaseUrlBuilderService', () => {
  let service: TenantDatabaseUrlBuilderService;
  let configService: jest.Mocked<ConfigService>;
  let module: TestingModule;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        TenantDatabaseUrlBuilderService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TenantDatabaseUrlBuilderService>(
      TenantDatabaseUrlBuilderService,
    );
    configService = module.get(ConfigService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildDatabaseUrl', () => {
    it('should build URL from master URL with credentials', () => {
      const masterUrl =
        'mongodb://user:password@localhost:27017/master?authSource=admin';
      configService.get.mockImplementation((key: string) => {
        if (key === 'MONGODB_URI') return masterUrl;
        return undefined;
      });

      const url = service.buildDatabaseUrl('tenant_db');

      expect(url).toBe(
        'mongodb://user:password@localhost:27017/tenant_db?authSource=admin',
      );
    });

    it('should build URL from master URL without credentials', () => {
      const masterUrl = 'mongodb://localhost:27017/master';
      configService.get.mockImplementation((key: string) => {
        if (key === 'MONGODB_URI') return masterUrl;
        return undefined;
      });

      const url = service.buildDatabaseUrl('tenant_db');

      expect(url).toBe('mongodb://localhost:27017/tenant_db?authSource=admin');
    });

    it('should build URL from master SRV URL', () => {
      const masterUrl =
        'mongodb+srv://user:password@cluster.mongodb.net/master?retryWrites=true&w=majority';
      configService.get.mockImplementation((key: string) => {
        if (key === 'MONGODB_URI') return masterUrl;
        return undefined;
      });

      const url = service.buildDatabaseUrl('tenant_db');

      expect(url).toContain('mongodb+srv://');
      expect(url).toContain('user:password@');
      expect(url).toContain('cluster.mongodb.net');
      expect(url).toContain('/tenant_db');
      expect(url).toContain('retryWrites=true');
    });

    it('should build URL from individual environment variables', () => {
      configService.get.mockImplementation((key: string) => {
        const config: Record<string, string> = {
          MONGODB_USERNAME: 'testuser',
          MONGODB_PASSWORD: 'testpass',
          MONGODB_HOST: 'testhost',
          MONGODB_PORT: '27018',
        };
        return config[key];
      });

      const url = service.buildDatabaseUrl('tenant_db');

      expect(url).toBe(
        'mongodb://testuser:testpass@testhost:27018/tenant_db?authSource=admin',
      );
    });

    it('should build URL without credentials if not provided', () => {
      configService.get.mockImplementation((key: string) => {
        const config: Record<string, string> = {
          MONGODB_HOST: 'localhost',
          MONGODB_PORT: '27017',
        };
        return config[key];
      });

      const url = service.buildDatabaseUrl('tenant_db');

      expect(url).toBe('mongodb://localhost:27017/tenant_db');
    });

    it('should handle URL parsing errors gracefully', () => {
      const invalidUrl = 'not-a-valid-url';
      configService.get.mockImplementation((key: string) => {
        if (key === 'MONGODB_URI') return invalidUrl;
        return undefined;
      });

      const url = service.buildDatabaseUrl('tenant_db');

      // Should fallback to default format
      expect(url).toBe('mongodb://localhost:27017/tenant_db');
    });

    it('should preserve query parameters from master URL', () => {
      const masterUrl =
        'mongodb://user:pass@host:27017/master?authSource=admin&ssl=true';
      configService.get.mockImplementation((key: string) => {
        if (key === 'MONGODB_URI') return masterUrl;
        return undefined;
      });

      const url = service.buildDatabaseUrl('tenant_db');

      expect(url).toContain('authSource=admin');
      expect(url).toContain('ssl=true');
    });

    it('should use MONGODB_USER as fallback for username', () => {
      configService.get.mockImplementation((key: string) => {
        const config: Record<string, string> = {
          MONGODB_USER: 'fallbackuser',
          MONGODB_PASSWORD: 'pass',
          MONGODB_HOST: 'host',
          MONGODB_PORT: '27017',
        };
        return config[key];
      });

      const url = service.buildDatabaseUrl('tenant_db');

      expect(url).toContain('fallbackuser:pass@');
    });
  });
});
