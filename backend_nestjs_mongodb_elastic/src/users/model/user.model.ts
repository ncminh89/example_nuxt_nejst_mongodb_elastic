import { Field, ID, ObjectType, Directive } from '@nestjs/graphql';
import { RoleEnum } from '../enum/role.enum';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;

}
