import { UserDTO } from './user.interface';

export interface AuthPayloadDTO {
  user: UserDTO;
  token: string;
}
