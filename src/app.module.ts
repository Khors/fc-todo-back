import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { Assigned } from './entities/assigned.entity';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { TaskController } from './tasks/task.controller';
import { TaskService } from './tasks/task.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Task, User, Assigned],
      synchronize: true
    }),
    TypeOrmModule.forFeature([
      Task,
      User,
      Assigned,
    ])
  ],
  controllers: [
    AppController,
    UserController,
    TaskController,
  ],
  providers: [
    AppService,
    UserService,
    TaskService,
  ],
})
export class AppModule { }
