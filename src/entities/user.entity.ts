import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { Assigned } from './assigned.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({
        type: 'enum',
        enum: ['MANAGER', 'DEVELOPER'],
        nullable: true,
    })
    role: 'MANAGER' | 'DEVELOPER';

    @OneToMany(() => Assigned, (assigned) => assigned.user)
    assignments: Assigned[];
}
