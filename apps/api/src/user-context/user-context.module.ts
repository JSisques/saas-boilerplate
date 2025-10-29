import { SharedModule } from '@/shared/shared.module';
import { UserModule } from '@/user-context/users/user.module';
import { Module } from '@nestjs/common';

const MODULES = [UserModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class UserContextModule {}
