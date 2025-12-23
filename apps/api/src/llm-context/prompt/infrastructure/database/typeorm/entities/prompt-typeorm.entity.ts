import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('prompts')
@Index(['slug'])
export class PromptTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'integer' })
  version: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PromptStatusEnum,
  })
  status: PromptStatusEnum;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;
}
