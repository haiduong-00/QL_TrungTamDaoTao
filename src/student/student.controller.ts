import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

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

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
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
