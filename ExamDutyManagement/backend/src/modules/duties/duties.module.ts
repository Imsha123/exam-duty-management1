import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutiesController } from './duties.controller';
import { DutiesService } from './duties.service';
import { Duty, Employee, City, Center, Exam, Role, Shift } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Duty, Employee, City, Center, Exam, Role, Shift])],
  controllers: [DutiesController],
  providers: [DutiesService],
  exports: [DutiesService],
})
export class DutiesModule {}
