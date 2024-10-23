import { Injectable } from '@nestjs/common';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';
import { DatabaseProvider } from '../database/database.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassSession } from './entities/class-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassSessionService {
  constructor(
    @InjectRepository(ClassSession)
    private classSessionRepository: Repository<ClassSession>,
  ) { }

  // async findByTeacherId(teacherId: number): Promise<ClassSession[]> {
  //   return this.classSessionRepository.find({
  //     where: {
  //       teacher: { id: teacherId }, // Tìm kiếm theo teacherId
  //     },
  //     relations: ['subject', 'classroom'], // Tùy chọn: đưa vào các quan hệ nếu cần
  //   });
  // }
  create(createClassSessionDto: CreateClassSessionDto) {
    return 'This action adds a new classSession';
  }

  findAll() {
    return `This action returns all classSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classSession`;
  }

  update(id: number, updateClassSessionDto: UpdateClassSessionDto) {
    return `This action updates a #${id} classSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} classSession`;
  }
}
