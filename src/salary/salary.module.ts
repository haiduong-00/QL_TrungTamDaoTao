import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { Repository } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { SubjectTeacher } from '../subject-teacher/entities/subject-teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingProgram } from '../training-program/entities/training-program.entity';
import { StudentTrainingProgram } from '../student-training-program/entities/student-training-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, SubjectTeacher, TrainingProgram, StudentTrainingProgram])],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule { }
