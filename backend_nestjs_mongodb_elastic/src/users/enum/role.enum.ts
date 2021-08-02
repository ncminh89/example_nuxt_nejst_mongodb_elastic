import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  RECEPTIONIST = 'RECEPTIONIST',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MODERATOR = 'MODERATOR',
}
registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});
