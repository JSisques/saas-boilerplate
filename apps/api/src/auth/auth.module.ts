import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  providers: [SupabaseService],
  controllers: [AuthController],
})
export class AuthModule {}
