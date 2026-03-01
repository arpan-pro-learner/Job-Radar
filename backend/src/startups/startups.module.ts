import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StartupsService } from './startups.service';
import { StartupsController } from './startups.controller';
import { Startup } from './entities/startup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Startup])],
  controllers: [StartupsController],
  providers: [StartupsService],
  exports: [StartupsService],
})
export class StartupsModule {}
