import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassSession } from "../../class-session/entities/class-session.entity";

@Entity('phong_hoc')
export class Classroom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => ClassSession, (classSession) => classSession.phong_hoc)
    buoi_hoc: ClassSession[];
}
