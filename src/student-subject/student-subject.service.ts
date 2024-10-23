import { Injectable } from '@nestjs/common';
import { CreateStudentSubjectDto } from './dto/create-student-subject.dto';
import { UpdateStudentSubjectDto } from './dto/update-student-subject.dto';

@Injectable()
export class StudentSubjectService {
  create(createStudentSubjectDto: CreateStudentSubjectDto) {
    return 'This action adds a new studentSubject';
  }

  findAll() {
    return `This action returns all studentSubject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentSubject`;
  }

  update(id: number, updateStudentSubjectDto: UpdateStudentSubjectDto) {
    return `This action updates a #${id} studentSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentSubject`;
  }
}
