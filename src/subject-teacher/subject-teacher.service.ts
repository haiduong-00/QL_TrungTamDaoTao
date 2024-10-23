import { Injectable } from '@nestjs/common';
import { CreateSubjectTeacherDto } from './dto/create-subject-teacher.dto';
import { UpdateSubjectTeacherDto } from './dto/update-subject-teacher.dto';

@Injectable()
export class SubjectTeacherService {
  create(createSubjectTeacherDto: CreateSubjectTeacherDto) {
    return 'This action adds a new subjectTeacher';
  }

  findAll() {
    return `This action returns all subjectTeacher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subjectTeacher`;
  }

  update(id: number, updateSubjectTeacherDto: UpdateSubjectTeacherDto) {
    return `This action updates a #${id} subjectTeacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} subjectTeacher`;
  }
}
