import { User } from './user.model';
import { Field, ID, Int, ObjectType, Directive } from '@nestjs/graphql';
import { UserMutationEnum } from '../enum/userMutation.enum';

@ObjectType()
export class UserSubPayload {
  @Field()
  user: User;
  @Field()
  mutation: UserMutationEnum;
}
