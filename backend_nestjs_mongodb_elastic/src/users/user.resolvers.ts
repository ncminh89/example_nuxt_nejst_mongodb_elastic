import { RoleEnum } from './enum/role.enum';
import { UserDTO } from './interfaces/user.interface';
import { UserSearchService } from './user_search.service';
import { AuthGuard } from './../shared/auth/auth.guard';
import { UserSubPayload } from './model/userSubPayload.model';
import { UserMutationEnum } from './enum/userMutation.enum';
import { AuthPayload } from './model/authPayload.model';
import { CreateUserInput } from './inputs/createUser.input';
import { User } from './model/user.model';
import { UserService } from './user.service';
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
import { LoginInput } from './inputs/login.input';
import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserInput } from './inputs/updateUser.input';
import { DeleteUserInput } from './inputs/deleteUser.input';
import { PubSub } from 'graphql-subscriptions';
import { Auth } from '../shared/auth/auth.model';
import { SearchUsersInput } from './inputs/searchUsers.input';

const pubsub = new PubSub();

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private userSearchService: UserSearchService,
  ) { }

  // @UseGuards(AuthGuard)
  @Query(() => [User])
  async users(@Context('user') user: any) {
    return await this.userService.findAll();
  }

  @Query(() => [User])
  async searchUsers(@Args('input') input: SearchUsersInput) {
    return await this.userSearchService.search(input.text);
  }

  @Query(() => User)
  async userById(@Args('id') id: string) {
    return await this.userService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async me(@Context('user') user: any) {
    const found = await this.userService.findById(user.userId);
    if (!found) {
      throw new UnauthorizedException('Cannot find user');
    } else {
      return found;
    }
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    var login = await this.userService.login(input);
    return login;
  }

  @Mutation(() => AuthPayload)
  async createUser(@Args('input') input: CreateUserInput) {
    const created = await this.userService.createUser(input);
    this.userSearchService.create(created.user);
    pubsub.publish('userMutationSub', {
      mutation: UserMutationEnum.CREATED,
      user: created.user,
    });

    return created;
  }

  //@UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @Context('user') user: Auth,
  ) {
    const updated = await this.userService.updateUser(input);
    this.userSearchService.update(updated);
    pubsub.publish('userMutationSub', {
      mutation: UserMutationEnum.UPDATED,
      user: updated,
    });

    return updated;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async deleteUser(
    @Args('input') input: DeleteUserInput,
    @Context('user') user: Auth,
  ) {
    const deleted = await this.userService.deleteUser(input, user);
    this.userSearchService.delete(deleted);
    pubsub.publish('userMutationSub', {
      mutation: UserMutationEnum.DELETED,
      user: deleted,
    });
    return deleted;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async recreateUserELS(@Context('user') user: Auth) {
    await this.userSearchService.deleteAll();
    const users: UserDTO[] = await this.userService.findAll();
    for (let user of users) {
      await this.userSearchService.create(user);
    }
    return true;
  }

  @Subscription(() => UserSubPayload, {
    name: 'userMutationSub',
    nullable: true,
    resolve: (value) => {
      return value;
    },
  })
  userMutationSub() {
    return pubsub.asyncIterator('userMutationSub');
  }
}
