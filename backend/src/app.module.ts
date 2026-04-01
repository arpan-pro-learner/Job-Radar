import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StartupsModule } from './startups/startups.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        const dbType = configService.get<string>('DB_TYPE', 'postgres');

        if (dbType === 'sqlite') {
          logger.log('Connecting to database using: SQLITE (local)');
          return {
            type: 'sqlite',
            database: 'database.sqlite',
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        const dbUrl = configService.get<string>('DATABASE_URL');
        if (dbUrl) {
          try {
            const parsedUrl = new URL(dbUrl);
            logger.log(`Connecting to database using: DATABASE_URL (host: ${parsedUrl.hostname})`);
          } catch (e) {
            logger.log('Connecting to database using: DATABASE_URL (unrollable URL format)');
          }
          
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        const host = configService.get<string>('DB_HOST', 'localhost');
        logger.log(`Connecting to database using: POSTGRES (host: ${host})`);
        
        return {
          type: 'postgres',
          host: host,
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'founder_radar'),
          autoLoadEntities: true,
          synchronize: true, 
        };
      },
      inject: [ConfigService],
    }),
    StartupsModule,
    IngestionModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
