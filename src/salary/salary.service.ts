import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { Repository } from 'typeorm';
import { SubjectTeacher } from '../subject-teacher/entities/subject-teacher.entity';
import { TrainingProgram } from '../training-program/entities/training-program.entity';
import { StudentTrainingProgram } from '../student-training-program/entities/student-training-program.entity';
import { DatabaseProvider } from '../database/database.provider';

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
        private readonly databaseProvider: DatabaseProvider
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
    async tinhLuongGiangVienSQL(): Promise<any> {
        const client = await this.databaseProvider.getPool().connect();
        try {
            const res = await client.query(`
        SELECT 
            nv.id AS giao_vien_id,
            nv.ten AS giao_vien_ten,
			gv_mh.vai_tro as vai_tro,
            SUM(
                CASE 
                    WHEN gv_mh.vai_tro = 'giao_vien' THEN mh.so_gio * nv.luong_moi_gio 
                    WHEN gv_mh.vai_tro = 'tro_giang' THEN mh.so_gio * nv.luong_moi_gio * 0.5
                    ELSE 0
                END
            ) AS tong_luong
        FROM public.nhan_vien nv
        JOIN public.giao_vien_mon_hoc gv_mh ON nv.id = gv_mh."giaoVienId"
        JOIN public.mon_hoc mh ON gv_mh."monHocId" = mh.id
        GROUP BY nv.id, nv.ten, gv_mh.vai_tro;
        `)
            return res.rows;
        } finally {
            client.release();
        }
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

    async tinhLuongNhanVienSQL(): Promise<any> {
        const client = await this.databaseProvider.getPool().connect();
        try {
            const res = await client.query(`
            WITH 
            -- Bảng tính số học viên trong mỗi chương trình đào tạo do nhân viên quản lý
            ProgramStudentCount AS (
                SELECT 
                    ctdt."nhanVienId" AS manager_id,
                    COUNT(hvctdt."hocVienId") AS student_count
                FROM 
                    chuong_trinh_dao_tao AS ctdt
                LEFT JOIN 
                    hoc_vien_chuong_trinh AS hvctdt ON ctdt.id = hvctdt."chuongTrinhDaoTaoId"
                GROUP BY 
                    ctdt."nhanVienId"
            ),

            -- Bảng tính số nhân viên dưới quyền cho mỗi nhân viên quản lý
            SubordinateCount AS (
                SELECT 
                    quan_ly.id AS manager_id,
                    COUNT(nv.id) AS subordinate_count
                FROM 
                    nhan_vien AS nv
                JOIN 
                    nhan_vien AS quan_ly ON nv."quanLyId" = quan_ly.id
                GROUP BY 
                    quan_ly.id
            )

            -- Tính tổng lương cho từng nhân viên
            SELECT 
                nv.id AS employee_id,
                nv.ten AS employee_name,
                5000000 AS base_salary,
                COALESCE(psc.student_count, 0) * 100000 AS management_salary_luong_QL_CT,
                COALESCE(sc.subordinate_count, 0) * (5000000 * 0.05) AS subordinate_bonus_luong_QL_NV,
                5000000 + 
                    (COALESCE(psc.student_count, 0) * 100000) + 
                    (COALESCE(sc.subordinate_count, 0) * (5000000 * 0.05)) AS total_salary
            FROM 
                nhan_vien AS nv
            LEFT JOIN 
                ProgramStudentCount AS psc ON nv.id = psc.manager_id
            LEFT JOIN 
                SubordinateCount AS sc ON nv.id = sc.manager_id;

        `)
            return res.rows;
        } finally {
            client.release();
        }
    }

}
