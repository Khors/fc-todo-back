import {
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Body,
    Param,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { TaskService } from './task.service';
  
  @Controller('tasks')
  export class TaskController {
    constructor(private readonly taskService: TaskService) {}
  
    /**
     * Retrieves all tasks via HTTP GET request
     * @route GET /tasks
     * @returns {Promise<Task[]>} An array of task objects with related assignments and users
     * @throws {Error} Database error if the query fails
     */
    @Get()
    async getAllTasks() {
      return this.taskService.getAllTasks();
    }
  
    /**
     * Creates a new task via HTTP POST request
     * @route POST /tasks
     * @param {string} name - The name of the task, provided in the request body
     * @param {string} description - The description of the task, provided in the request body
     * @param {number} estimate - The estimated time or effort for the task, provided in the request body
     * @returns {Promise<Task>} The created task object
     * @throws {HttpException} 400 - If name or estimate is missing
     * @throws {Error} Database error if saving fails
     */
    @Post()
    async createTask(
      @Body('name') name: string,
      @Body('description') description: string,
      @Body('estimate') estimate: number,
    ) {
      if (!name || !estimate) {
        throw new HttpException('Name and estimate are required', HttpStatus.BAD_REQUEST);
      }
      return this.taskService.createTask(name, description, estimate);
    }
  
    /**
     * Deletes a task by ID via HTTP DELETE request
     * @route DELETE /tasks/:id
     * @param {number} id - The identifier of the task, provided as a URL parameter
     * @returns {Promise<Object>} An object with a confirmation message
     * @throws {HttpException} 400 - If ID is missing or invalid
     * @throws {NotFoundException} 404 - If the task with the given ID is not found
     * @throws {Error} Database error if deletion fails
     */
    @Delete(':id')
    async deleteTask(@Param('id') id: number) {
      if (!id) {
        throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
      }
      await this.taskService.deleteTask(id);
      return { message: `Task with ID ${id} has been deleted.` };
    }
  
    /**
     * Updates the status of a task via HTTP PATCH request
     * @route PATCH /tasks/:id/status
     * @param {number} id - The identifier of the task, provided as a URL parameter
     * @param {'PENDING' | 'IN_PROGRESS' | 'SOLVED'} status - The new status of the task, provided in the request body
     * @returns {Promise<Task>} The updated task object
     * @throws {HttpException} 400 - If status is missing or invalid
     * @throws {NotFoundException} 404 - If the task with the given ID is not found
     * @throws {Error} Database error if saving fails
     */
    @Patch(':id/status')
    async updateTaskStatus(
      @Param('id') id: number,
      @Body('status') status: 'PENDING' | 'IN_PROGRESS' | 'SOLVED',
    ) {
      if (!status || !['PENDING', 'IN_PROGRESS', 'SOLVED'].includes(status)) {
        throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
      }
      return this.taskService.updateTaskStatus(id, status);
    }
  
    /**
     * Assigns a user to a task via HTTP POST request
     * @route POST /tasks/:taskId/assign/:userId
     * @param {number} taskId - The identifier of the task, provided as a URL parameter
     * @param {number} userId - The identifier of the user, provided as a URL parameter
     * @returns {Promise<Assigned>} The created assignment object
     * @throws {HttpException} 400 - If task ID or user ID is missing
     * @throws {NotFoundException} 404 - If the task or user with the given ID is not found
     * @throws {Error} Database error if saving fails
     */
    @Post(':taskId/assign/:userId')
    async assignUserToTask(
      @Param('taskId') taskId: number,
      @Param('userId') userId: number,
    ) {
      if (!taskId || !userId) {
        throw new HttpException('Task ID and User ID are required', HttpStatus.BAD_REQUEST);
      }
      return this.taskService.assignUserToTask(taskId, userId);
    }
  
    /**
     * Removes a user from a task via HTTP DELETE request
     * @route DELETE /tasks/:taskId/assign/:userId
     * @param {number} taskId - The identifier of the task, provided as a URL parameter
     * @param {number} userId - The identifier of the user, provided as a URL parameter
     * @returns {Promise<Task>} The updated task object with related assignments
     * @throws {HttpException} 400 - If task ID or user ID is missing
     * @throws {NotFoundException} 404 - If the assignment or task with the given IDs is not found
     * @throws {Error} Database error if deletion or retrieval fails
     */
    @Delete(':taskId/assign/:userId')
    async removeUserFromTask(
      @Param('taskId') taskId: number,
      @Param('userId') userId: number,
    ) {
      if (!taskId || !userId) {
        throw new HttpException('Task ID and User ID are required', HttpStatus.BAD_REQUEST);
      }
      const updatedTask = await this.taskService.removeUserFromTask(taskId, userId);
      return updatedTask;
    }
  }