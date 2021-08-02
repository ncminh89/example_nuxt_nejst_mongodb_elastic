import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchUsersInput {
  @Field()
  text: string;
}
