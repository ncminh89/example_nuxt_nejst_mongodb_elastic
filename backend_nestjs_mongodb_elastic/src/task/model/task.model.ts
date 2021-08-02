import { Field, ID, ObjectType, Directive, Float } from '@nestjs/graphql';
import { User } from 'src/users/model/user.model';

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;
  @Field()
  text: string;
  @Field(() => Float, {nullable: true})
  order: number;
  @Field()
  done: boolean;
  @Field()
  created_by_id: string;
  @Field(() => User)
  created_by: User
  @Field()
  created_at: string;
  @Field()
  updated_at: string;
}
