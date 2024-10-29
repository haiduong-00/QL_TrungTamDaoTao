import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Get(':studentId/program/:programId')
  async getStudentResultsInTranningProgram(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('programId', ParseIntPipe) programId: number
  ): Promise<any> {
    const result = await this.studentService.getStudentResultsInTranningProgram(studentId, programId);
    return result;
  }

  // API liệt kê các học viên chưa hoàn thành môn học của một chương trình đào tạo
  @Get('incomplete/:programId')
  async getIncompleteStudents(
    @Param('programId', ParseIntPipe) programId: number
  ): Promise<any> {
    const result = await this.studentService.getIncompleteStudents(programId);
    return result;
  }

  // API lấy thông tin tiến độ học tập của từng học viên
  @Get(':studentId/progress')
  async getStudentProgress(
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    return await this.studentService.getStudentProgress(studentId);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
