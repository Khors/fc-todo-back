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
    constructor(private readonly taskService: TaskService) { }

    @Get()
    async getAllTasks() {
        return this.taskService.getAllTasks();
    }

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

    @Delete(':id')
    async deleteTask(@Param('id') id: number) {
        if (!id) {
            throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
        }
        await this.taskService.deleteTask(id);
        return { message: `Task with ID ${id} has been deleted.` };
    }

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
