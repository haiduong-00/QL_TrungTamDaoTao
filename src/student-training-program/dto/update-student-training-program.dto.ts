import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentTrainingProgramDto } from './create-student-training-program.dto';

export class UpdateStudentTrainingProgramDto extends PartialType(CreateStudentTrainingProgramDto) {}
