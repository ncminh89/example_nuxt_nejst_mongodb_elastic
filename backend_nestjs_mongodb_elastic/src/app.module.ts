
import { UsersModule } from './users/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/logging_handler/http_error.filter';
import { LoggingInterceptor } from './shared/logging_handler/logging.interceptor';
import { MyLogger } from './logger/logger.service';
import { TasksModule } from './task/task.module';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    MongooseModule.forRoot(
      'mongodb://devroot:devroot@localhost:27017/lookme?authSource=admin',
      {
        useCreateIndex: true,
      },
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    MyLogger,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
