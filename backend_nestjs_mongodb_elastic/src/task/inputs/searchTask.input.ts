import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchTaskInput {
  @Field()
  text: string;
}
