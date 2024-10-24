import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { UpdateTrainingProgramDto } from './dto/update-training-program.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('training-program')
@Controller('training-program')
export class TrainingProgramController {
  constructor(private readonly trainingProgramService: TrainingProgramService) {}

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
