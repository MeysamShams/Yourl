import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { UrlModule } from './url/url.module';


@Module({
  imports: [DatabaseModule, AuthModule, UtilsModule,UrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
