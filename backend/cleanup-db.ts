import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { StartupsService } from './src/startups/startups.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const startupsService = app.get(StartupsService);
  
  console.log('Cleaning up HN and YC sourced jobs...');
  
  const hnResult = await startupsService.removeBySource('HN Hiring') as any;
  console.log(`Deleted HN Jobs: ${hnResult.deletedCount}`);
  
  const ycResult = await startupsService.removeBySource('YC Jobs') as any;
  console.log(`Deleted YC Jobs: ${ycResult.deletedCount}`);
  
  await app.close();
}

bootstrap().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
