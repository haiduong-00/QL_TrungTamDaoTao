import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { TrainingProgram } from "../../training-program/entities/training-program.entity";
import { ClassSession } from "../../class-session/entities/class-session.entity";
import { StudentSubject } from "../../student-subject/entities/student-subject.entity";

@Entity('mon_hoc')
@Unique(['ten', 'chuong_trinh_dao_tao']) // Đảm bảo tên môn học là duy nhất trong cùng một chương trình
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    ten: string;

    @Column('int')
    so_gio: number;

    @ManyToOne(() => TrainingProgram, (trainingProgram) => trainingProgram.mon_hoc)
    chuong_trinh_dao_tao: TrainingProgram;

    @OneToMany(() => StudentSubject, (studentSubject) => studentSubject.mon_hoc)
    hoc_vien_mon_hoc: StudentSubject[];

    @OneToMany(() => ClassSession, (classSession) => classSession.mon_hoc)
    buoi_hoc: ClassSession[];
}
