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
  ) {}

  /**
   * Retrieves all tasks with their assignments and assigned users
   * @returns {Promise<Task[]>} An array of task objects with related assignments and users
   * @throws {Error} Database error if the query fails
   */
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['assignments', 'assignments.user'] });
  }

  /**
   * Creates a new task with the provided details
   * @param {string} name - The name of the task
   * @param {string} description - The description of the task
   * @param {number} estimate - The estimated time or effort for the task
   * @returns {Promise<Task>} The created task object
   * @throws {Error} Database error if saving fails
   */
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

  /**
   * Deletes a task by its identifier
   * @param {number} id - The identifier of the task
   * @returns {Promise<void>} Empty response on success
   * @throws {NotFoundException} 404 - If the task with the given ID is not found
   * @throws {Error} Database error if deletion fails
   */
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  /**
   * Updates the status of a task
   * @param {number} id - The identifier of the task
   * @param {'PENDING' | 'IN_PROGRESS' | 'SOLVED'} status - The new status of the task
   * @returns {Promise<Task>} The updated task object
   * @throws {NotFoundException} 404 - If the task with the given ID is not found
   * @throws {Error} Database error if saving fails
   */
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

  /**
   * Assigns a user to a task
   * @param {number} taskId - The identifier of the task
   * @param {number} userId - The identifier of the user
   * @returns {Promise<Assigned>} The created assignment object
   * @throws {NotFoundException} 404 - If the task or user with the given ID is not found
   * @throws {Error} Database error if saving fails
   */
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

  /**
   * Removes a user from a task
   * @param {number} taskId - The identifier of the task
   * @param {number} userId - The identifier of the user
   * @returns {Promise<Task>} The updated task object with related assignments
   * @throws {NotFoundException} 404 - If the assignment or task with the given IDs is not found
   * @throws {Error} Database error if deletion or retrieval fails
   */
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