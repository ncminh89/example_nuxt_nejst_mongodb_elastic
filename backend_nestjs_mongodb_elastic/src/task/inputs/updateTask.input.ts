import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput {
  @Field()
  task_id: string
  @Field({nullable: true})
  text: string
  @Field({nullable: true})
  order: number
  @Field({nullable: true})
  done: boolean
}
