import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { UtilsModule } from 'src/utils/utils.module';
import { PublicUrlController } from './public-url.controller';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  controllers: [UrlController,PublicUrlController],
  providers: [UrlService],
  imports:[UtilsModule,DatabaseModule,AuthModule]
})
export class UrlModule {}
