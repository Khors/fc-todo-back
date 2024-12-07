import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Assigned } from './assigned.entity';

@Entity({ name: 'tasks' })
export class Task {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'smallint', unsigned: true, nullable: true })
    estimate: number;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'IN_PROGRESS', 'SOLVED'],
        nullable: true,
    })
    status: 'PENDING' | 'IN_PROGRESS' | 'SOLVED';

    @OneToMany(() => Assigned, (assigned) => assigned.task)
    assignments: Assigned[];
}
