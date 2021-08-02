import { registerEnumType } from '@nestjs/graphql';

export enum UserMutationEnum {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}
registerEnumType(UserMutationEnum, {
  name: 'UserMutationEnum',
});
