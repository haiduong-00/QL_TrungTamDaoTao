import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentSubjectService } from './student-subject.service';
import { CreateStudentSubjectDto } from './dto/create-student-subject.dto';
import { UpdateStudentSubjectDto } from './dto/update-student-subject.dto';

@Controller('student-subject')
export class StudentSubjectController {
  constructor(private readonly studentSubjectService: StudentSubjectService) {}

  @Post()
  create(@Body() createStudentSubjectDto: CreateStudentSubjectDto) {
    return this.studentSubjectService.create(createStudentSubjectDto);
  }

  @Get()
  findAll() {
    return this.studentSubjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentSubjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentSubjectDto: UpdateStudentSubjectDto) {
    return this.studentSubjectService.update(+id, updateStudentSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentSubjectService.remove(+id);
  }
}
