import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { TrainingProgramModule } from './training-program/training-program.module';
import { SubjectModule } from './subject/subject.module';
import { StudentModule } from './student/student.module';
import { StudentTrainingProgramModule } from './student-training-program/student-training-program.module';
import { ClassroomModule } from './classroom/classroom.module';
import { SubjectTeacherModule } from './subject-teacher/subject-teacher.module';
import { Employee } from './employee/entities/employee.entity';
import { TrainingProgram } from './training-program/entities/training-program.entity';
import { Student } from './student/entities/student.entity';
import { StudentTrainingProgram } from './student-training-program/entities/student-training-program.entity';
import { SubjectTeacher } from './subject-teacher/entities/subject-teacher.entity';
import { Subject } from './subject/entities/subject.entity';
import { Classroom } from './classroom/entities/classroom.entity';
import { DatabaseProvider } from './database/database.provider';
import { ClassSessionModule } from './class-session/class-session.module';
import { ClassSession } from './class-session/entities/class-session.entity';
import { StudentSubjectModule } from './student-subject/student-subject.module';
import { StudentSubject } from './student-subject/entities/student-subject.entity';
import { SalaryModule } from './salary/salary.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'password',
            database: 'DB_QLTTDT',
            entities: [
                Employee,
                TrainingProgram,
                Subject,
                Student,
                Classroom,
                StudentTrainingProgram,
                SubjectTeacher,
                ClassSession,
                StudentSubject
            ],
            synchronize: true,
    }),
    EmployeeModule,
    TrainingProgramModule,
    SubjectModule,
    StudentModule,
    StudentTrainingProgramModule,
    ClassroomModule,
    SubjectTeacherModule,
    ClassSessionModule,
    StudentSubjectModule,
    SalaryModule
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseProvider],
})
export class AppModule {}
