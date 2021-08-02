import { RoleEnum } from './../enum/role.enum';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  userId: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  username?: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  password?: string;
  @Field({ nullable: true })
  branchId?: string;
  @Field(() => RoleEnum, { nullable: true })
  role?: RoleEnum;
  @Field({ nullable: true })
  avatar?: string;
  @Field({ nullable: true })
  isDisable?: boolean;
  @Field({ nullable: true })
  isDeleted?: boolean;
}
