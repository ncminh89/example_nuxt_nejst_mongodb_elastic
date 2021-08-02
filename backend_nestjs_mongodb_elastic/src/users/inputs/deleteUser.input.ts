import { RoleEnum } from './../enum/role.enum';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeleteUserInput {
  @Field()
  userId: string;
}
