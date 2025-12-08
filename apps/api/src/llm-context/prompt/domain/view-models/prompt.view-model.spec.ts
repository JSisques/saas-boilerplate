import { IPromptCreateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-create-view-model/prompt-create-view-model.dto';
import { IPromptUpdateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-update-view-model/prompt-update-view-model.dto';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';

describe('PromptViewModel', () => {
  const createBaseViewModel = (): PromptViewModel => {
    const dto: IPromptCreateViewModelDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      slug: 'test-prompt',
      version: 1,
      title: 'Test Prompt',
      description: 'Test description',
      content: 'Test content',
      status: PromptStatusEnum.DRAFT,
      isActive: true,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z'),
    };

    return new PromptViewModel(dto);
  };

  describe('constructor', () => {
    it('should create a PromptViewModel with all properties', () => {
      const viewModel = createBaseViewModel();

      expect(viewModel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(viewModel.slug).toBe('test-prompt');
      expect(viewModel.version).toBe(1);
      expect(viewModel.title).toBe('Test Prompt');
      expect(viewModel.description).toBe('Test description');
      expect(viewModel.content).toBe('Test content');
      expect(viewModel.status).toBe(PromptStatusEnum.DRAFT);
      expect(viewModel.isActive).toBe(true);
      expect(viewModel.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'));
      expect(viewModel.updatedAt).toEqual(new Date('2024-01-01T10:00:00Z'));
    });

    it('should create view model with null description', () => {
      const dto: IPromptCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: null,
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const viewModel = new PromptViewModel(dto);
      expect(viewModel.description).toBeNull();
    });

    it('should use provided dates for createdAt and updatedAt', () => {
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T10:00:00Z');
      const dto: IPromptCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt,
        updatedAt,
      };

      const viewModel = new PromptViewModel(dto);

      expect(viewModel.createdAt).toEqual(createdAt);
      expect(viewModel.updatedAt).toEqual(updatedAt);
    });
  });

  describe('update', () => {
    it('should update all provided properties', () => {
      const viewModel = createBaseViewModel();
      const updateDto: IPromptUpdateViewModelDto = {
        slug: 'updated-prompt',
        version: 2,
        title: 'Updated Title',
        description: 'Updated description',
        content: 'Updated content',
        status: PromptStatusEnum.ACTIVE,
        isActive: false,
      };

      viewModel.update(updateDto);

      expect(viewModel.slug).toBe('updated-prompt');
      expect(viewModel.version).toBe(2);
      expect(viewModel.title).toBe('Updated Title');
      expect(viewModel.description).toBe('Updated description');
      expect(viewModel.content).toBe('Updated content');
      expect(viewModel.status).toBe(PromptStatusEnum.ACTIVE);
      expect(viewModel.isActive).toBe(false);
    });

    it('should update only provided properties', () => {
      const viewModel = createBaseViewModel();
      const updateDto: IPromptUpdateViewModelDto = {
        title: 'Updated Title',
      };

      viewModel.update(updateDto);

      expect(viewModel.title).toBe('Updated Title');
      expect(viewModel.slug).toBe('test-prompt'); // Unchanged
      expect(viewModel.version).toBe(1); // Unchanged
    });

    it('should update updatedAt timestamp', () => {
      const viewModel = createBaseViewModel();
      const beforeUpdate = viewModel.updatedAt;
      const updateDto: IPromptUpdateViewModelDto = {
        title: 'Updated Title',
      };

      // Wait a bit to ensure timestamp difference
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      viewModel.update(updateDto);
      const afterUpdate = viewModel.updatedAt;

      expect(afterUpdate.getTime()).toBeGreaterThan(beforeUpdate.getTime());
      jest.useRealTimers();
    });

    it('should update description to null', () => {
      const viewModel = createBaseViewModel();
      const updateDto: IPromptUpdateViewModelDto = {
        description: null,
      };

      viewModel.update(updateDto);

      expect(viewModel.description).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return correct slug', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.slug).toBe('test-prompt');
    });

    it('should return correct version', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.version).toBe(1);
    });

    it('should return correct title', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.title).toBe('Test Prompt');
    });

    it('should return correct description', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.description).toBe('Test description');
    });

    it('should return correct content', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.content).toBe('Test content');
    });

    it('should return correct status', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.status).toBe(PromptStatusEnum.DRAFT);
    });

    it('should return correct isActive', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.isActive).toBe(true);
    });

    it('should return correct createdAt', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'));
    });

    it('should return correct updatedAt', () => {
      const viewModel = createBaseViewModel();
      expect(viewModel.updatedAt).toEqual(new Date('2024-01-01T10:00:00Z'));
    });
  });
});
