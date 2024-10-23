import { Module } from '@nestjs/common';
import { StudentTrainingProgramService } from './student-training-program.service';
import { StudentTrainingProgramController } from './student-training-program.controller';

@Module({
  controllers: [StudentTrainingProgramController],
  providers: [StudentTrainingProgramService],
})
export class StudentTrainingProgramModule {}
