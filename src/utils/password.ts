import { compare, hash } from 'bcrypt';

export const createPasswordhashed = async (
  password: string,
): Promise<string> => {
  const saltOrRounds = 10;

  return hash(password, saltOrRounds);
};

export const validationPassword = async (
  password: string,
  passwordHashed: string,
): Promise<boolean> => {
  return compare(password, passwordHashed);
};
