import { AuthGuard } from '../shared/auth/auth.guard';
import { CreateTaskInput } from './inputs/createTask.input';
import { Task } from './model/task.model';
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveReference,
  Context,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UpdateTaskInput } from './inputs/updateTask.input';
import { DeleteTaskInput } from './inputs/deleteTask.input';
import { PubSub } from 'graphql-subscriptions';
import { Auth } from '../shared/auth/auth.model';
import { SearchTaskInput } from './inputs/searchTask.input';
import { TaskService } from './task.service';
import { MutationEnum } from 'src/shared/enum/mutation.enum';
import { TaskInterface } from './interfaces/task.interface';
import { TaskSubPayload } from './model/taskSubPayload.model';
import { TaskSearchService } from './task_search.service';

const pubsub = new PubSub();

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private taskSearchService: TaskSearchService,
  ) { }

  // @UseGuards(AuthGuard)
  @Query(() => [Task])
  async tasks(@Context('task') task: any) {
    return await this.taskService.findAll();
  }

  @Query(() => [Task])
  async searchTasks(@Args('input') input: SearchTaskInput) {
    return await this.taskSearchService.search(input.text);
  }

  @Query(() => Task)
  async taskById(@Args('id') id: string) {
    return await this.taskService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Task])
  async myTasks(@Context('user') user: Auth) {
    var tasks = await this.taskService.findManyByCreator(user.userId);
    console.log(tasks)
    return tasks
  }
  
  @UseGuards(AuthGuard)
  @Mutation(() => Task)
  async createTask(@Args('input') input: CreateTaskInput, @Context('user') user: Auth) {
    const created = await this.taskService.createTask(input, user);
    this.taskSearchService.create(created);
    pubsub.publish('taskMutationSub', {
      mutation: MutationEnum.CREATED,
      task: created,
    });
    return created;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Task)
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @Context('task') task: Auth,
  ) {
    const updated = await this.taskService.updateTask(input);
    this.taskSearchService.update(updated);
    pubsub.publish('taskMutationSub', {
      mutation: MutationEnum.UPDATED,
      task: updated,
    });

    return updated;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Task)
  async deleteTask(
    @Args('input') input: DeleteTaskInput,
    @Context('task') task: Auth,
  ) {
    const deleted = await this.taskService.deleteTask(input, task);
    this.taskSearchService.delete(deleted);
    pubsub.publish('taskMutationSub', {
      mutation: MutationEnum.DELETED,
      task: deleted,
    });
    return deleted;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async recreateTaskELS(@Context('task') task: Auth) {
    await this.taskSearchService.deleteAll();
    const tasks: TaskInterface[] = await this.taskService.findAll();
    for (let task of tasks) {
      await this.taskSearchService.create(task);
    }
    return true;
  }

  @Subscription(() => TaskSubPayload, {
    name: 'taskMutationSub',
    nullable: true,
    resolve: (value) => {
      return value;
    },
  })
  taskMutationSub() {
    return pubsub.asyncIterator('taskMutationSub');
  }
}
