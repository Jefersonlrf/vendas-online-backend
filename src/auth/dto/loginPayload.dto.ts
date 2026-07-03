import { UserEntity } from '@/user/entities/user.entity';
import { UserType } from '@/user/enum/user-type.enum';

export class LoginPayload {
  id: number;
  typeUser: UserType;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.typeUser = user.typeUser;
  }
}
