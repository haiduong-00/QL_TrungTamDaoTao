import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseProvider } from '../database/database.provider';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, DatabaseProvider],
})
export class EmployeeModule {}
