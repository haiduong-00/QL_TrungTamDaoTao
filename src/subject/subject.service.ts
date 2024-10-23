import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DatabaseProvider } from '../database/database.provider';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(private readonly databaseProvider: DatabaseProvider) { }

  async create(createSubjectDto: CreateSubjectDto): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      await client.query('INSERT INTO subject (ten) VALUES ($1)', [createSubjectDto.ten])
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Subject[]> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      const res = await client.query("SELECT * FROM subject");
      return res.rows;
    } finally {
      client.release();
    }
  }

  async findOne(id: number): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      await client.query('SELECT * FROM subject WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      await client.query('UPDATE subject SET ten = $1 WHERE id = $2', [updateSubjectDto.ten, id]);
    } finally {
      client.release();
    }
  }

  async remove(id: number): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      await client.query('DELETE FROM subject WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
}
