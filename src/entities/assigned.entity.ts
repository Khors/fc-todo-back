import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity({ name: 'assigned' })
export class Assigned {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Index('fk_asigned_tasks_idx')
    @ManyToOne(() => Task, (task) => task.assignments, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'tasks_id' })
    task: Task;

    @Index('fk_asigned_users1_idx')
    @ManyToOne(() => User, (user) => user.assignments, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'users_id' })
    user: User;
}
