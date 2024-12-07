import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './../entities/task.entity';
import { Assigned } from './../entities/assigned.entity';
import { User } from './../entities/user.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(Assigned)
        private readonly assignedRepository: Repository<Assigned>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.find({ relations: ['assignments', 'assignments.user'] });
    }

    async createTask(
        name: string,
        description: string,
        estimate: number,
    ): Promise<Task> {
        const newTask = this.taskRepository.create({
            name,
            description,
            estimate,
            status: 'PENDING',
            createAt: new Date(),
        });
        return this.taskRepository.save(newTask);
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async updateTaskStatus(
        id: number,
        status: 'PENDING' | 'IN_PROGRESS' | 'SOLVED',
    ): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        task.status = status;
        return this.taskRepository.save(task);
    }

    async assignUserToTask(taskId: number, userId: number): Promise<Assigned> {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const assigned = this.assignedRepository.create({ task, user });
        return this.assignedRepository.save(assigned);
    }

    async removeUserFromTask(taskId: number, userId: number): Promise<Task> {
        const assignment = await this.assignedRepository.findOne({
            where: {
                task: { id: taskId },
                user: { id: userId },
            },
            relations: ['task', 'user'],
        });

        if (!assignment) {
            throw new NotFoundException(`Assignment not found for Task ID ${taskId} and User ID ${userId}`);
        }

        await this.assignedRepository.delete(assignment.id);

        const updatedTask = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['assignments', 'assignments.user'],
        });

        if (!updatedTask) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }

        return updatedTask;
    }
}
