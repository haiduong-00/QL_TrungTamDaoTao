import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "../../employee/entities/employee.entity";
import { Subject } from "../../subject/entities/subject.entity";

@Entity('chuong_trinh_dao_tao')
export class TrainingProgram {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ten: string;

    @ManyToOne(() => Employee, (employee) => employee.chuong_trinh_dao_tao)
    nhan_vien: Employee;

    @OneToMany(() => Subject, (subject) => subject.chuong_trinh_dao_tao)
    mon_hoc: Subject[];
}
