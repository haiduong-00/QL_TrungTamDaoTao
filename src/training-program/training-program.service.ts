import { Injectable } from '@nestjs/common';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { UpdateTrainingProgramDto } from './dto/update-training-program.dto';

@Injectable()
export class TrainingProgramService {
  create(createTrainingProgramDto: CreateTrainingProgramDto) {
    return 'This action adds a new trainingProgram';
  }

  findAll() {
    return `This action returns all trainingProgram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingProgram`;
  }

  update(id: number, updateTrainingProgramDto: UpdateTrainingProgramDto) {
    return `This action updates a #${id} trainingProgram`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingProgram`;
  }
}
