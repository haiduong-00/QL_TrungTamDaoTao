import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentTrainingProgramService } from './student-training-program.service';
import { CreateStudentTrainingProgramDto } from './dto/create-student-training-program.dto';
import { UpdateStudentTrainingProgramDto } from './dto/update-student-training-program.dto';

@Controller('student-training-program')
export class StudentTrainingProgramController {
  constructor(private readonly studentTrainingProgramService: StudentTrainingProgramService) {}

  @Post()
  create(@Body() createStudentTrainingProgramDto: CreateStudentTrainingProgramDto) {
    return this.studentTrainingProgramService.create(createStudentTrainingProgramDto);
  }

  @Get()
  findAll() {
    return this.studentTrainingProgramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentTrainingProgramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentTrainingProgramDto: UpdateStudentTrainingProgramDto) {
    return this.studentTrainingProgramService.update(+id, updateStudentTrainingProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentTrainingProgramService.remove(+id);
  }
}
