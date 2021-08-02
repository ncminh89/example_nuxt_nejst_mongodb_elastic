import { Field, InputType, Int } from '@nestjs/graphql';
import { RoleEnum } from '../enum/role.enum';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
