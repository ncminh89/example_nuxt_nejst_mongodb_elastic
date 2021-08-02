import { Field, ID, Int, ObjectType, Directive } from '@nestjs/graphql';
import { MutationEnum } from 'src/shared/enum/mutation.enum';
import { Task } from './task.model';

@ObjectType()
export class TaskSubPayload {
  @Field()
  task: Task;
  @Field()
  mutation: MutationEnum;
}
