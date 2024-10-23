import { Module } from '@nestjs/common';
import { ClassSessionService } from './class-session.service';
import { ClassSessionController } from './class-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSession } from './entities/class-session.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClassSession])],
  controllers: [ClassSessionController],
  providers: [ClassSessionService, Repository<ClassSession>],
  exports: [ClassSessionService],
})
export class ClassSessionModule {}
