import { Module } from '@nestjs/common';
import { SubjectTeacherService } from './subject-teacher.service';
import { SubjectTeacherController } from './subject-teacher.controller';

@Module({
  controllers: [SubjectTeacherController],
  providers: [SubjectTeacherService],
})
export class SubjectTeacherModule {}
