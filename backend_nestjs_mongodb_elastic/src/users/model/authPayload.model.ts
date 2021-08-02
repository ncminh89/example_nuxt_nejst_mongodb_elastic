import { User } from './user.model';
import { Field, ID, Int, ObjectType, Directive } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  user: User;
  @Field()
  token: string;
}
