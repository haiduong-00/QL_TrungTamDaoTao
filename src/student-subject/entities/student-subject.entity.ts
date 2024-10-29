import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Unique, Check } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('hoc_vien_mon_hoc')
@Check(`"diem" >= 0 AND "diem" <= 10`) // Ràng buộc giá trị của cột `diem`
export class StudentSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.hoc_vien_mon_hoc)
  hoc_vien: Student;

  @ManyToOne(() => Subject, (subject) => subject.hoc_vien_mon_hoc)
  mon_hoc: Subject;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  diem: number;
}