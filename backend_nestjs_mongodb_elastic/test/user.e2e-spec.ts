import { SearchUsersInput } from './../src/users/inputs/searchUsers.input';
import { LoginInput } from './../src/users/inputs/login.input';
import { UpdateUserInput } from './../src/users/inputs/updateUser.input';
import { DeleteUserInput } from './../src/users/inputs/deleteUser.input';
import { User } from './../dist/users copy/interfaces/user.interface.d';
import { CreateUserInput } from '../src/users/inputs/createUser.input';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import {
  createUserQuery,
  deleteUserQuery,
  loginQuery,
  searchUsersQuery,
  updateUserQuery,
} from './graphql/user.graphql';

describe('UserTest (e2e)', () => {
  let app: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://devroot:devroot@localhost:27017/test01?authSource=admin',
          {
            useCreateIndex: true,
          },
        ),
        GraphQLModule.forRoot({
          autoSchemaFile: 'schema.gql',
          installSubscriptionHandlers: true,
        }),
        AppModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let user: User;
  let token: string;
  let authorization: string;

  const createUserInput: CreateUserInput = {
    name: 'Yen 001',
    username: 'test01',
    password: 'test123',
  };

  const loginInput: LoginInput = {
    username: 'test01',
    password: 'test123',
  };

  const loginInputFailUserName: LoginInput = {
    username: 'test01123',
    password: 'test123',
  };

  const loginInputFailPassword: LoginInput = {
    username: 'test01',
    password: 'test1234123',
  };

  let updateUserInput: UpdateUserInput = {
    userId: null,
    name: 'Test 02',
  };

  let deleteUserInput: DeleteUserInput = {
    userId: null,
  };

  let searchUsersInput: SearchUsersInput = {
    text: 'ye',
  };

  it('sucess create new user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: createUserQuery,
        variables: {
          input: createUserInput,
        },
      })
      .expect(({ body }) => {
        user = body.data.createUser.user as User;
        token = body.data.createUser.token;
        expect(user.name).toEqual(createUserInput.name);
        expect(user.username).toEqual(createUserInput.username);
        expect(token).not.toBeNull;
        authorization = 'Bearer ' + token;
        updateUserInput.userId = user.id;
        deleteUserInput.userId = user.id;
      })
      .expect(200);
  });

  it('create user fail: same username', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: createUserQuery,
        variables: {
          input: createUserInput,
        },
      })
      .expect(({ body }) => {
        expect(body.errors).not.toBeNull;
        expect(body.errors[0].message).toEqual('username is exited');
      })
      .expect(200);
  });

  it('search user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: searchUsersQuery,
        variables: {
          input: searchUsersInput,
        },
      })
      .expect(({ body }) => {
        expect(body.data.searchUsers[0].name).toEqual(createUserInput.name);
      });
    // .expect(200);
  });

  it('login user sucess', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: loginQuery,
        variables: {
          input: loginInput,
        },
      })
      .expect(({ body }) => {
        user = body.data.login.user as User;
        token = body.data.login.token;
        expect(user.username).toEqual(loginInput.username);
        expect(token).not.toBeNull;
        authorization = 'Bearer ' + token;
        updateUserInput.userId = user.id;
        deleteUserInput.userId = user.id;
      })
      .expect(200);
  });

  it('login user fail username', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: loginQuery,
        variables: {
          input: loginInputFailUserName,
        },
      })
      .expect(({ body }) => {
        expect(body.errors).not.toBeNull;
        expect(body.errors[0].message).toEqual('Username not found');
      });
    // .expect(200);
  });

  it('login user fail password', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: loginQuery,
        variables: {
          input: loginInputFailPassword,
        },
      })
      .expect(({ body }) => {
        expect(body.errors).not.toBeNull;
        expect(body.errors[0].message).toEqual('Wrong password');
      });
    // .expect(200);
  });

  it('update user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', authorization)
      .send({
        operationName: null,
        query: updateUserQuery,
        variables: {
          input: updateUserInput,
        },
      })
      .expect(({ body }) => {
        user = body.data.updateUser as User;
        expect(user.name).toEqual(updateUserInput.name);
      })
      .expect(200);
  });

  it('deleteUser', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', authorization)
      .send({
        operationName: null,
        query: deleteUserQuery,
        variables: {
          input: deleteUserInput,
        },
      })
      .expect(({ body }) => {
        expect(body.errors).toBeNull;
      })
      .expect(200);
  });
});
