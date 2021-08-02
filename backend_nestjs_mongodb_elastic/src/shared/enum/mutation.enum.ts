import { registerEnumType } from '@nestjs/graphql';

export enum MutationEnum {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}
registerEnumType(MutationEnum, {
  name: 'MutationEnum',
});
