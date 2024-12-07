import { Controller, Post, Delete, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(
        @Body('name') name: string,
        @Body('role') role: 'MANAGER' | 'DEVELOPER',
    ) {
        if (!name || !role) {
            throw new HttpException('Name and role are required', HttpStatus.BAD_REQUEST);
        }
        return this.userService.createUser(name, role);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        if (!id) {
            throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
        }
        await this.userService.deleteUser(id);
        return { message: `User with ID ${id} has been deleted.` };
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
}
