import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "../../student/entities/student.entity";
import { TrainingProgram } from "../../training-program/entities/training-program.entity";

@Entity('hoc_vien_chuong_trinh')
export class StudentTrainingProgram {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Student, (student) => student.hoc_vien_chuong_trinh)
    hoc_vien: Student;

    @ManyToOne(() => TrainingProgram, (trainingProgram) => trainingProgram.mon_hoc)
    chuong_trinh_dao_tao: TrainingProgram;
}
