import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectTeacherService } from './subject-teacher.service';
import { CreateSubjectTeacherDto } from './dto/create-subject-teacher.dto';
import { UpdateSubjectTeacherDto } from './dto/update-subject-teacher.dto';

@Controller('subject-teacher')
export class SubjectTeacherController {
  constructor(private readonly subjectTeacherService: SubjectTeacherService) {}

  @Post()
  create(@Body() createSubjectTeacherDto: CreateSubjectTeacherDto) {
    return this.subjectTeacherService.create(createSubjectTeacherDto);
  }

  @Get()
  findAll() {
    return this.subjectTeacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectTeacherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectTeacherDto: UpdateSubjectTeacherDto) {
    return this.subjectTeacherService.update(+id, updateSubjectTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectTeacherService.remove(+id);
  }
}
