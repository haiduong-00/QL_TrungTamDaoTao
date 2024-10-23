import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "../../classroom/entities/classroom.entity";
import { Subject } from "../../subject/entities/subject.entity";

@Entity('buoi_hoc')
export class ClassSession {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Subject, (subject) => subject.buoi_hoc)
    mon_hoc: Subject;

    @ManyToOne(() => Classroom, (classroom) => classroom.buoi_hoc)
    phong_hoc: Classroom;

    @Column('timestamp')
    thoi_gian: Date;
}
