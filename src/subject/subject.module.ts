import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { DatabaseProvider } from '../database/database.provider';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, DatabaseProvider],
})
export class SubjectModule {}
