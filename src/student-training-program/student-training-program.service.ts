import { Injectable } from '@nestjs/common';
import { CreateStudentTrainingProgramDto } from './dto/create-student-training-program.dto';
import { UpdateStudentTrainingProgramDto } from './dto/update-student-training-program.dto';
import { StudentTrainingProgram } from './entities/student-training-program.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { StudentSubject } from '../student-subject/entities/student-subject.entity';
import { Subject } from '../subject/entities/subject.entity';

@Injectable()
export class StudentTrainingProgramService {
  create(createStudentTrainingProgramDto: CreateStudentTrainingProgramDto) {
    return 'This action adds a new studentTrainingProgram';
  }

  findAll() {
    return `This action returns all studentTrainingProgram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentTrainingProgram`;
  }

  update(id: number, updateStudentTrainingProgramDto: UpdateStudentTrainingProgramDto) {
    return `This action updates a #${id} studentTrainingProgram`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentTrainingProgram`;
  }
}
