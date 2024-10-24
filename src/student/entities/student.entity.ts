import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TrainingProgram } from "../../training-program/entities/training-program.entity";
import { StudentTrainingProgram } from "../../student-training-program/entities/student-training-program.entity";
import { StudentSubject } from "../../student-subject/entities/student-subject.entity";

@Entity('hoc_vien')
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ten: string;

    @Column('date')
    ngay_sinh?: string;

    @OneToMany(() => StudentTrainingProgram, (studentTrainingProgram) => studentTrainingProgram.hoc_vien)
    hoc_vien_chuong_trinh: StudentTrainingProgram[];

    @OneToMany(() => StudentSubject, (studentSubject) => studentSubject.hoc_vien)
    hoc_vien_mon_hoc: StudentSubject[];
}
