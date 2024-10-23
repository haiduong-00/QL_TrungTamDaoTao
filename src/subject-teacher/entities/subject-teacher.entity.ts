import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../../subject/entities/subject.entity";
import { Employee } from "../../employee/entities/employee.entity";

@Entity('giao_vien_mon_hoc')
export class SubjectTeacher {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Employee, (employee) => employee.chuong_trinh_dao_tao)
    giao_vien: Employee;

    @ManyToOne(() => Subject, (subject) => subject.hoc_vien_mon_hoc)
    mon_hoc: Subject; 

    @Column()
    vai_tro: string; // 'giang_vien' hoặc 'tro_giang'
}
