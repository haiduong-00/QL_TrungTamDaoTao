import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectTeacherDto } from './create-subject-teacher.dto';

export class UpdateSubjectTeacherDto extends PartialType(CreateSubjectTeacherDto) {}
