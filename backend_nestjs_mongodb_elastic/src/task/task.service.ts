import { Auth } from '../shared/auth/auth.model';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TaskInterface } from './interfaces/task.interface';
import { UpdateTaskInput } from './inputs/updateTask.input';
import { DeleteTaskInput } from './inputs/deleteTask.input';
import { CreateTaskInput } from './inputs/createTask.input';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private taskModel: Model<TaskInterface>,
  ) { }

  public async findAll(): Promise<TaskInterface[]> {
    return await this.taskModel.find().exec();
  }

  public async findById(task_id: string): Promise<TaskInterface> {
    const found = await this.taskModel
      .findOne({
        _id: task_id,
      })
      .exec();
    if (!found) {
      return null;
    }
    return found;
  }

  public async findManyById(ids: [string]): Promise<TaskInterface[]> {
    let found = await this.taskModel.find({
      _id: { $in: ids },
    });
    if (!found) {
      return null;
    }
    return found;
  }

  public async findManyByCreator(id: string): Promise<TaskInterface[]> {
    let found = await this.taskModel.find({
      created_by_id: id
    }
      
    ).sort([["order", 1]]);
    if (!found) {
      return null;
    }
    return found;
  }

  public async createTask(input: CreateTaskInput, auth: Auth): Promise<TaskInterface> {
    const createdTask = await this.taskModel.create({
      ...input,
      created_by_id: auth.userId
    });
    return createdTask.save();
  }

  public async updateTask(input: UpdateTaskInput): Promise<TaskInterface> {
    const task_id = input.task_id
    delete input.task_id
    const updated = await this.taskModel
      .findOneAndUpdate(
        { _id: task_id },
        {
          $set: input
        },
        { new: true },
      )
      .exec();
    return updated;
  }

  public async deleteTask(
    input: DeleteTaskInput,
    task: Auth,
  ): Promise<TaskInterface> {
    const deleted = await this.taskModel.findOneAndRemove({
      _id: input.task_id,
    });
    return deleted;
  }

  public async deleteAllTasks() {
    const deleted = await this.taskModel.deleteMany();
    return deleted;
  }
}
