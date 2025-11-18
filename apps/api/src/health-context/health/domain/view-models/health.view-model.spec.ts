import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';

describe('HealthViewModel', () => {
  it('should expose status via getter', () => {
    const viewModel = new HealthViewModel({
      status: 'OK',
      writeDatabaseStatus: 'OK',
      readDatabaseStatus: 'OK',
    });
    expect(viewModel.status).toBe('OK');
    expect(viewModel.writeDatabaseStatus).toBe('OK');
    expect(viewModel.readDatabaseStatus).toBe('OK');
  });
});
