import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient,Db } from 'mongodb';

@Module({
    providers: [
        {
          provide: 'DATABASE_CONNECTION',
          inject:[ConfigService],
          useFactory: async (configService:ConfigService): Promise<Db> => {
            try {
              const client = await MongoClient.connect(configService.get<string>('database.url'));
              return client.db(configService.get<string>('database.name'));
            } catch (e) {
              throw e;
            }
          }
        },
      ],
      exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
