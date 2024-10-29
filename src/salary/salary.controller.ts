import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('salary')
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) { }

  @Get()
  async getSalary() {
    const luong = await this.salaryService.tinhLuongGiangVienSQL();
    return { luonggiangvien: luong };
  }

  @Get('/salaryEmployee/:employeeId')
  async calculateEmployeeSalary(@Param('employeeId', ParseIntPipe) employeeId: number) {
    const luong = await this.salaryService.calculateEmployeeSalary(employeeId);
    return { luongnhanvien: luong };
  }

  @Get('salaryEmployee')
  async calculateEmployeeSalarySQL() {
    const luong = await this.salaryService.tinhLuongNhanVienSQL();
    return { luongNhanVien: luong }
  }
}
