import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { Repository } from 'typeorm';
import { SubjectTeacher } from '../subject-teacher/entities/subject-teacher.entity';
import { TrainingProgram } from '../training-program/entities/training-program.entity';
import { StudentTrainingProgram } from '../student-training-program/entities/student-training-program.entity';

@Injectable()
export class SalaryService {
    private readonly baseSalary = 5000000;
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        @InjectRepository(SubjectTeacher)
        private subjectTeacherRepository: Repository<SubjectTeacher>,
        @InjectRepository(TrainingProgram)
        private trainingProgramRepository: Repository<TrainingProgram>,
        @InjectRepository(StudentTrainingProgram)
        private studentTrainingProgramRepository: Repository<StudentTrainingProgram>,
    ) { }

    async calculateSalary(employeeId: number): Promise<any> {
        // Tìm tất cả môn mà giáo viên tham gia
        const assigments = await this.subjectTeacherRepository.find({
            where: { giao_vien: { id: employeeId } },
            relations: ['mon_hoc', 'giao_vien']
        })

        let tong_so_gio_day = 0;
        assigments.forEach((assigment) => {
            tong_so_gio_day += assigment.mon_hoc.so_gio;
        });

        const nhan_vien = await this.employeeRepository.findOne({ where: { id: employeeId } });

        // Tính lương dựa trên vai trò
        let luong = 0;
        assigments.forEach((assigment) => {
            const tiLeGio = assigment.vai_tro === 'giang_vien' ? nhan_vien.luong_moi_gio : nhan_vien.luong_moi_gio / 2;
            luong += assigment.mon_hoc.so_gio * tiLeGio;
        })

        return luong;
    }

    async calculateEmployeeSalary(employeeId: number): Promise<number> {
        let totalSalary = this.baseSalary;
        // Lấy danh sách các chương trình đào tạo mà nhân viên đang quản lý
        const trainingPrograms = await this.trainingProgramRepository.find({
            where: { nhan_vien: { id: employeeId } },
        });

        for (const program of trainingPrograms) {
            const numberOfStudents = await this.studentTrainingProgramRepository.count({
                where: { chuong_trinh_dao_tao: { id: program.id } }
            })
            // Giả sử lương quản lý mỗi học viên là 100,000 vnđ
            totalSalary += numberOfStudents * 100000;
        }

        const subordinates = await this.employeeRepository.find({
            where: { quan_ly: { id: employeeId } }
        });

        // Cộng thêm cộng thêm 5% lương cứng tương ứng với mỗi nhân viên dưới quyền quản lý của mình.
        totalSalary += subordinates.length * (this.baseSalary * 0.05);
        return totalSalary;
    }

}
