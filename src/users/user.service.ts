import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user in the system
   * @param {string} name - The name of the user
   * @param {'MANAGER' | 'DEVELOPER'} role - The role of the user (MANAGER or DEVELOPER)
   * @returns {Promise<User>} The created user object
   * @throws {Error} Database error if saving fails
   */
  async createUser(name: string, role: 'MANAGER' | 'DEVELOPER'): Promise<User> {
    const newUser = this.userRepository.create({ name, role });
    return this.userRepository.save(newUser);
  }

  /**
   * Deletes a user by their identifier
   * @param {number} id - The identifier of the user
   * @returns {Promise<void>} Empty response on success
   * @throws {Error} Database error if the user is not found or deletion fails
   */
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Retrieves a list of all users
   * @returns {Promise<User[]>} An array of user objects
   * @throws {Error} Database error if the query fails
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}