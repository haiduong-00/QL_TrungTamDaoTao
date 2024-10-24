import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('salary')
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) { }

  @Get(':employeeId')
  async getSalary(@Param('employeeId', ParseIntPipe) employeeId: number) {
    const luong = await this.salaryService.calculateSalary(employeeId);
    return { luonggiangvien: luong };
  }

  @Get('/salaryEmployee/:employeeId')
  async calculateEmployeeSalary(@Param('employeeId', ParseIntPipe) employeeId: number) {
    const luong = await this.salaryService.calculateEmployeeSalary(employeeId);
    return { luongnhanvien: luong };
  }
}
