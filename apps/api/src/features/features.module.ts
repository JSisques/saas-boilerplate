import { UserModule } from '@/features/users/user.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const FEATURES = [UserModule];

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [...FEATURES],
})
export class FeaturesModule {}
