import { Controller, Post, Delete, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user via HTTP POST request
   * @route POST /users
   * @param {string} name - The name of the user, provided in the request body
   * @param {'MANAGER' | 'DEVELOPER'} role - The role of the user (MANAGER or DEVELOPER), provided in the request body
   * @returns {Promise<User>} The created user object
   * @throws {HttpException} 400 - If name or role is missing
   * @throws {Error} Database error if saving fails
   */
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

  /**
   * Deletes a user by ID via HTTP DELETE request
   * @route DELETE /users/:id
   * @param {number} id - The identifier of the user, provided as a URL parameter
   * @returns {Promise<Object>} An object with a confirmation message
   * @throws {HttpException} 400 - If ID is missing or invalid
   * @throws {Error} Database error if the user is not found or deletion fails
   */
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    if (!id) {
      throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
    }
    await this.userService.deleteUser(id);
    return { message: `User with ID ${id} has been deleted.` };
  }

  /**
   * Retrieves all users via HTTP GET request
   * @route GET /users
   * @returns {Promise<User[]>} An array of user objects
   * @throws {Error} Database error if the query fails
   */
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}