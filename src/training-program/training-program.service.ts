import { Injectable } from '@nestjs/common';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { UpdateTrainingProgramDto } from './dto/update-training-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentTrainingProgram } from '../student-training-program/entities/student-training-program.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { StudentSubject } from '../student-subject/entities/student-subject.entity';
import { Subject } from '../subject/entities/subject.entity';
import { DatabaseProvider } from '../database/database.provider';

@Injectable()
export class TrainingProgramService {
  constructor(
    @InjectRepository(StudentTrainingProgram)
    private readonly studentProgramRepository: Repository<StudentTrainingProgram>,
    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepository: Repository<StudentSubject>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private databaseProvider: DatabaseProvider
  ) { }

  async getStudentResultsInTranningProgramSQL(programId: number) {
    const client = await this.databaseProvider.getPool().connect();
    try {
      const res = await client.query(`
            SELECT 
              hv.id as hoc_vien_id,
              hv.ten as hoc_vien_ten,
              ctdt.id as hoc_vien_ct_id,
              ctdt.ten as chuong_trinh_dao_tao_ten,
              mh.id AS mon_hoc_id,
              mh.ten AS mon_hoc_ten,
              hvmh.diem AS diem
            FROM 
              public.hoc_vien as hv
            JOIN 
              public.hoc_vien_chuong_trinh as hvct on hv.id = hvct."hocVienId"
            JOIN 
              public.chuong_trinh_dao_tao as ctdt on hvct."chuongTrinhDaoTaoId" = ctdt.id
            JOIN 
              public.mon_hoc as mh on mh."chuongTrinhDaoTaoId" = ctdt.id
            LEFT JOIN 
                public.hoc_vien_mon_hoc AS hvmh ON hvmh."hocVienId" = hv.id AND hvmh."monHocId" = mh.id
            WHERE 
                ctdt.id = $1  -- ID của chương trình học cụ thể
            ORDER BY 
                hv.id, mh.id;
        `, [programId])
      return res.rows;
    } finally {
      client.release();
    }
  }

  async getProgramProgressReport(programId: number) {
    const students = await this.studentProgramRepository.find({
      where: { chuong_trinh_dao_tao: { id: programId } },
      relations: ['hoc_vien']
    })

    const report = {
      totalStudents: students.length,
      completedStudents: 0,
      ongoingStudents: 0,
      droppedOutStudents: 0,
    }

    for (const studentprogram of students) {
      const completedSubjects = await this.studentSubjectRepository.count({
        where: { hoc_vien: { id: studentprogram.hoc_vien.id }, diem: MoreThanOrEqual(5) }
      });
      const totalSubjects = await this.subjectRepository.count({
        where: { chuong_trinh_dao_tao: { id: programId } },
      });

      if (completedSubjects === totalSubjects) {
        report.completedStudents++;
      } else if (completedSubjects > 0) {
        report.ongoingStudents++;
      } else {
        report.droppedOutStudents++;
      }
    }
    return report;
  }

  create(createTrainingProgramDto: CreateTrainingProgramDto) {

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
