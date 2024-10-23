import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../database/database.provider';
import { Employee } from './entities/employee.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly databaseProvider: DatabaseProvider) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
        // Kiểm tra giá trị của ten
        if (!createEmployeeDto.ten || createEmployeeDto.ten.trim() === '') {
            throw new Error('Ten is required and cannot be empty');
        }

        // Chèn nhân viên vào cơ sở dữ liệu
        await client.query('INSERT INTO employee (ten) VALUES ($1)', [createEmployeeDto.ten]);
    } catch (error) {
        console.error('Error inserting employee:', error.message);
        throw new Error('Failed to insert employee: ' + error.message);
    } finally {
        client.release();
    }
}


  async findAll(): Promise<Employee[]> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      const res = await client.query("SELECT * FROM employee");
      return res.rows;
    } finally {
      client.release();
    }
  }

  async findOne(id: number): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      await client.query('SELECT * FROM employees WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      await client.query('UPDATE employee SET ten = $1 WHERE id = $2', [updateEmployeeDto.ten, id]);
    } finally {
      client.release();
    }
  }

  async remove(id: number): Promise<void> {
    const client = await this.databaseProvider.getPool().connect();
    try {
      await client.query('DELETE FROM employee WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
}
