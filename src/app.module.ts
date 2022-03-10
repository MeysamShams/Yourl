import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';


@Module({
  imports: [DatabaseModule, AuthModule, UtilsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
