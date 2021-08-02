import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(() => ID)
  userId: string;
  @Field(() => ID)
  shopId: string;
  @Field({ nullable: true })
  iat?: Number;
  @Field({ nullable: true })
  exp?: Number;
}
