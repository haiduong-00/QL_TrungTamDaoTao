import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { TrainingProgram } from '../training-program/entities/training-program.entity';
import { StudentTrainingProgram } from '../student-training-program/entities/student-training-program.entity';
import { StudentSubject } from '../student-subject/entities/student-subject.entity';
import { Subject } from '../subject/entities/subject.entity';
import * as Excel from "exceljs";
import { Response } from "express";
import { DatabaseProvider } from '../database/database.provider';

@Injectable()
export class StudentService {
  private readonly passScore = 5; // Điểm qua môn là 5

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(TrainingProgram)
    private trainingProgramRepository: Repository<TrainingProgram>,
    @InjectRepository(StudentTrainingProgram)
    private studentProgramRepository: Repository<StudentTrainingProgram>,
    @InjectRepository(StudentSubject)
    private studentSubjectRepository: Repository<StudentSubject>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    private databaseProvider: DatabaseProvider,
  ) { }

  // Phương thức lấy kết quả học tập của một học viên trong một chương trình học
  async getStudentResultsInTranningProgram(studentId: number, programId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['hoc_vien_chuong_trinh', 'hoc_vien_chuong_trinh.chuong_trinh_dao_tao', 'hoc_vien_mon_hoc', 'hoc_vien_mon_hoc.mon_hoc']
    })

    // Kiểm tra học viên có tham gia chương trình học này không
    const trainingProgram = student.hoc_vien_chuong_trinh.find(
      (program) => program.chuong_trinh_dao_tao.id === programId
    );

    if (!trainingProgram) {
      throw new Error('Học viên không tham gia chương trình đào tạo này!')
    }

    // Lấy kết quả của các môn học trong chương trình
    const results = student.hoc_vien_mon_hoc.map((studentSubject) => ({
      monHoc: studentSubject.mon_hoc.ten,
      diem: studentSubject.diem,
    }))
    return {
      hoc_vien: student.ten,
      chuong_trinh: trainingProgram.chuong_trinh_dao_tao.ten,
      ket_qua: results,
    };
  }

  // async getStudyResults(studentId: number, programId: number): Promise<any> {
  //   // Kiểm tra xem học viên có thuộc chương trình đào tạo này không
  //   const studentProgram = await this.studentProgramRepository.findOne({
  //     where: { hoc_vien: { id: studentId }, chuong_trinh_dao_tao: { id: programId } },
  //     relations: ['chuong_trinh_dao_tao', 'hoc_vien'],
  //   });

  //   if (!studentProgram) {
  //     throw new Error('Student is not enrolled in this program');
  //   }

  //   // Lấy tất cả các môn học và điểm của học viên trong chương trình
  //   const studyResults = await this.studentSubjectRepository.find({
  //     where: {
  //       hoc_vien: { id: studentId },
  //       mon_hoc: { chuong_trinh_dao_tao: { id: programId } },
  //     },
  //     relations: ['mon_hoc', 'hoc_vien'],
  //   });

  //   return studyResults.map((result) => ({
  //     mon_hoc: result.mon_hoc.ten,
  //     so_gio: result.mon_hoc.so_gio,
  //     diem: result.diem,
  //   }));
  // }

  async getIncompleteStudents(trainingProgramId: number): Promise<any[]> {
    const subjects = await this.subjectRepository.find({
      where: { chuong_trinh_dao_tao: { id: trainingProgramId } }
    })

    const students = await this.studentProgramRepository.find({
      where: { chuong_trinh_dao_tao: { id: trainingProgramId } },
      relations: ['hoc_vien']
    })

    const incompleteStudents = [];

    for (const studentProgram of students) {
      const student = studentProgram.hoc_vien;
      let incompleteSubjects = [];

      for (const subject of subjects) {
        const studentSubject = await this.studentSubjectRepository.findOne({
          where: { hoc_vien: { id: student.id }, mon_hoc: { id: subject.id } }
        });

        if (!studentSubject || studentSubject.diem < this.passScore) {
          incompleteSubjects.push({
            subjectId: subject.id,
            subjectTen: subject.ten,
            subjectDiem: studentSubject.diem,
          })
        }
      }
      if (incompleteSubjects.length > 0) {
        incompleteStudents.push({
          studentId: student.id,
          studentName: student.ten,
          incompleteSubjects: incompleteSubjects,
        });
      }
    }
    return incompleteStudents;
  }

  async getIncompleteStudentsSQL(trainingProgramId: number) {
    const client = await this.databaseProvider.getPool().connect();
    try {
      const res = await client.query(`
      --- Liệt kê toàn bộ các học viên chưa hoàn thành xong các môn học của một chương trình đào tạo nào đó.
      --- Lay ra 
      WITH TotalSubjects AS (
          -- Đếm số môn học trong chương trình đào tạo
          SELECT 
              ct.id AS program_id,
              COUNT(mh.id) AS total_subjects
          FROM 
              chuong_trinh_dao_tao AS ct
          JOIN 
              mon_hoc AS mh ON mh."chuongTrinhDaoTaoId" = ct.id
          WHERE 
              ct.id = 1
          GROUP BY 
              ct.id
      ),
      StudentCompletion AS (
          -- Đếm số môn học mà mỗi học viên đã hoàn thành với điểm >= 5
          SELECT 
              hvct."hocVienId" AS student_id,
              hvct."chuongTrinhDaoTaoId" AS program_id,
              COUNT(hvmh."monHocId") AS completed_subjects
          FROM 
              hoc_vien_chuong_trinh AS hvct
          JOIN 
              hoc_vien_mon_hoc AS hvmh ON hvct."hocVienId" = hvmh."hocVienId"
          JOIN 
              mon_hoc AS mh ON hvmh."monHocId" = mh.id
          WHERE 
              hvct."chuongTrinhDaoTaoId" = 1
              AND hvmh.diem >= 5
          GROUP BY 
              hvct."hocVienId", hvct."chuongTrinhDaoTaoId"
      )
      
      -- Liệt kê toàn bộ học viên chưa hoàn thành chương trình
      SELECT 
          hv.id AS student_id,
          hv.ten AS student_name,
          ts.total_subjects,
          COALESCE(sc.completed_subjects, 0) as completed_subjects,
          ARRAY_AGG(mh.id) AS incomplete_subjects
      FROM 
          hoc_vien AS hv
      JOIN 
          hoc_vien_chuong_trinh AS hvct ON hv.id = hvct."hocVienId"
      JOIN 
          TotalSubjects AS ts ON hvct."chuongTrinhDaoTaoId" = ts.program_id
      LEFT JOIN 
          StudentCompletion AS sc ON hv.id = sc.student_id
      LEFT JOIN 
          mon_hoc AS mh ON mh."chuongTrinhDaoTaoId" = ts.program_id
          AND mh.id NOT IN (
              SELECT hvmh."monHocId"
              FROM hoc_vien_mon_hoc as hvmh
              WHERE hvmh."hocVienId" = hv.id AND diem >= 5
          )
      WHERE 
          hvct."chuongTrinhDaoTaoId" = 1
          AND COALESCE(sc.completed_subjects, 0) < ts.total_subjects
      GROUP BY 
          hv.id, ts.total_subjects, sc.completed_subjects;
      
        `, [trainingProgramId])
      return res.rows;
    } finally {
      client.release();
    }
  }

  // Triển khai API lấy tiến độ học tập của học viên
  async getStudentProgress(studentId: number) {
    // Lấy thông tin học viên và các chương trình đào tạo mà họ tham gia
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['hoc_vien_chuong_trinh', 'hoc_vien_chuong_trinh.chuong_trinh_dao_tao']
    })

    if (!student) {
      throw new Error('Sinh viên không tồn tại.');
    }

    // lấy tất cả các môn học mà sinh viên đã tham gia chương trình
    const subjects = await this.studentSubjectRepository.find({
      where: {
        hoc_vien: { id: studentId },  // Lọc theo học viên
      },
      relations: ['mon_hoc'],  // Kết nối với bảng môn học
    });

    const programProgress = await Promise.all(
      student.hoc_vien_chuong_trinh.map(async (program) => {

        // Xử lý trạng thái hoàn thành của từng môn hoc
        const subjectProgress = subjects.map((subject) => ({
          subjectId: subject.mon_hoc.id,
          subjectName: subject.mon_hoc.ten,
          score: subject.diem,
          status: subject.diem >= 5 ? 'Completed' : 'Incomplete',
        }));

        return {
          programId: program.chuong_trinh_dao_tao.id,
          programName: program.chuong_trinh_dao_tao.ten,
          subjects: subjectProgress,
        };
      })
    )
    return {
      studentId: student.id,
      studentName: student.ten,
      programs: programProgress,  // Danh sách các chương trình cùng tiến độ của học viên
      // tileSoMonHoanThanh: subjects.length,
    };
  }

  // async exportSubjectStudent(res: Response, reportData: any) {
  //   // const hocVienMonHoc = await this.studentSubjectRepository.find({
  //   //   where: { mon_hoc: { id: monHocId } },
  //   //   relations: ['hoc_vien']
  //   // })
  //   const workbook = new Excel.Workbook();
  //   const worksheet = workbook.addWorksheet('Student Report');

  //   // Thêm header cho các cột trong file Excel
  //   worksheet.columns = [
  //     { header: 'Student Name', key: 'studentName', width: 30 },
  //     { header: 'Subject', key: 'subject', width: 30 },
  //     { header: 'Score', key: 'score', width: 10 },
  //     { header: 'Status', key: 'status', width: 15 },
  //   ];

  //   // Thêm dữ liệu vào các hàng trong file Excel
  //   reportData.forEach((student) => {
  //     student.subjects.forEach((subject) => {
  //       worksheet.addRow({
  //         studentName: student.name,
  //         subject: subject.name,
  //         score: subject.score,
  //         status: subject.status,
  //       });
  //     });
  //   });

  //   // Định dạng header
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //     cell.alignment = { horizontal: 'center' };
  //   });

  //   // Thiết lập phản hồi để tải file về
  //   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  //   res.setHeader('Content-Disposition', `attachment; filename=student-report.xlsx`);

  //   // Ghi dữ liệu Excel vào response
  //   await workbook.xlsx.write(res);

  //   // Kết thúc response
  //   res.end();
  // }

  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
