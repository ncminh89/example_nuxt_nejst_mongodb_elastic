import { RoleEnum } from '../enum/role.enum';

export interface UserSearchBodyDTO {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: RoleEnum;
  avatar?: string;
}
