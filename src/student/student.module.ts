import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { TrainingProgram } from '../training-program/entities/training-program.entity';
import { StudentTrainingProgram } from '../student-training-program/entities/student-training-program.entity';
import { StudentSubject } from '../student-subject/entities/student-subject.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, TrainingProgram, StudentTrainingProgram, StudentSubject, Subject])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule { }
