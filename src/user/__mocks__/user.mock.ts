import { UserEntity } from "../entities/user.entity";
import { UserType } from "../enum/user-type.enum";

export const userEntityMock: UserEntity = {
  cpf: '1234543543',
  createdAt: new Date(),
  email: 'emailmock@email.com',
  id: 43242,
  name: 'nameMock',
  password: 'largePassword',
  phone: '321532523532',
  typeUser: UserType.User,
  updatedAt: new Date(),
};
