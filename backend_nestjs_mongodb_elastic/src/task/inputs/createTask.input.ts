import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field()
  text: string;
  @Field()
  order: number;
}
