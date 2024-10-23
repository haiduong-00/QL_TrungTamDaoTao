import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TrainingProgram } from "../../training-program/entities/training-program.entity";

@Entity('nhan_vien')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ten: string;

    @Column()
    chuc_vu: string;

    @ManyToOne(() => Employee, employee => employee.quan_ly)
    quan_ly: Employee;

    @OneToMany(() => TrainingProgram, trainingProgram => trainingProgram.nhan_vien)
    chuong_trinh_dao_tao: TrainingProgram[];

    @Column('decimal')
    luong_moi_gio: number;
}
