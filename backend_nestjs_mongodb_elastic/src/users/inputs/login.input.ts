import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}
