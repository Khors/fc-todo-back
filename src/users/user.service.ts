import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createUser(name: string, role: 'MANAGER' | 'DEVELOPER'): Promise<User> {
        const newUser = this.userRepository.create({ name, role });
        return this.userRepository.save(newUser);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
}
