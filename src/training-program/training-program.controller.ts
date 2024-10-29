import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { UpdateTrainingProgramDto } from './dto/update-training-program.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('training-program')
@Controller('training-program')
export class TrainingProgramController {
  constructor(private readonly trainingProgramService: TrainingProgramService) {}

  @Get(':programId')
  async getStudentResultsInTranningProgramSQL(
    @Param('programId', ParseIntPipe) programId: number
  ) {
    return await this.trainingProgramService.getStudentResultsInTranningProgramSQL(programId)
  }

  // Báo cáo tổng quan theo chương trình đào tạo Sử dụng bảng StudentProgram để lấy danh sách học viên và kiểm tra trạng thái hoàn thành của từng học viên.
  @Get(':programId/progress-report')
  async getProgramProgressReport(
    @Param('programId', ParseIntPipe) programId: number
  ) {
    return await this.trainingProgramService.getProgramProgressReport(programId)
  }

  @Post()
  create(@Body() createTrainingProgramDto: CreateTrainingProgramDto) {
    return this.trainingProgramService.create(createTrainingProgramDto);
  }

  @Get()
  findAll() {
    return this.trainingProgramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingProgramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingProgramDto: UpdateTrainingProgramDto) {
    return this.trainingProgramService.update(+id, updateTrainingProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingProgramService.remove(+id);
  }
}
