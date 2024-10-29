import { Module } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { TrainingProgramController } from './training-program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentTrainingProgram } from '../student-training-program/entities/student-training-program.entity';
import { StudentSubject } from '../student-subject/entities/student-subject.entity';
import { Subject } from '../subject/entities/subject.entity';
import { DatabaseProvider } from '../database/database.provider';

@Module({
  imports: [TypeOrmModule.forFeature([StudentTrainingProgram, StudentSubject, Subject])],
  controllers: [TrainingProgramController],
  providers: [TrainingProgramService, DatabaseProvider],
})
export class TrainingProgramModule {}
