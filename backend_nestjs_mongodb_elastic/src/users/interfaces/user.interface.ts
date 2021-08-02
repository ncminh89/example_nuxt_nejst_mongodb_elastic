import { RoleEnum } from './../enum/role.enum';
import { Document } from 'mongoose';

export interface UserDTO extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  role: RoleEnum;
  avatar: string;
  isDisable: boolean;
  isDeleted: boolean;
}
