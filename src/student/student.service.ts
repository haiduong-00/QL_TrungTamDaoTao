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

  async getStudyResults(studentId: number, programId: number): Promise<any> {
    // Kiểm tra xem học viên có thuộc chương trình đào tạo này không
    const studentProgram = await this.studentProgramRepository.findOne({
      where: { hoc_vien: { id: studentId }, chuong_trinh_dao_tao: { id: programId } },
      relations: ['chuong_trinh_dao_tao', 'hoc_vien'],
    });

    if (!studentProgram) {
      throw new Error('Student is not enrolled in this program');
    }

    // Lấy tất cả các môn học và điểm của học viên trong chương trình
    const studyResults = await this.studentSubjectRepository.find({
      where: {
        hoc_vien: { id: studentId },
        mon_hoc: { chuong_trinh_dao_tao: { id: programId } },
      },
      relations: ['mon_hoc', 'hoc_vien'],
    });

    return studyResults.map((result) => ({
      mon_hoc: result.mon_hoc.ten,
      so_gio: result.mon_hoc.so_gio,
      diem: result.diem,
    }));
  }

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
