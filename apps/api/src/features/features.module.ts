import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const FEATURES = [];

@Module({
  imports: [SharedModule, ...FEATURES],
  controllers: [],
  providers: [],
})
export class FeaturesModule {}
