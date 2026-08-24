import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserMock } from '../__mocks__/createUser.mock';
import {
  updatePasswordInvalidMock,
  updatePasswordMock,
} from '../__mocks__/update-user.mock';
import { userEntityMock } from '../__mocks__/user.mock';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            find: jest.fn().mockResolvedValue([userEntityMock]),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findUserByEmail', () => {
    it('should return user by email', async () => {
      const user = await service.findUserByEmail(userEntityMock.email);

      expect(user).toEqual(userEntityMock);
    });

    it('should throw when user email is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findUserByEmail(userEntityMock.email),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when database fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(
        service.findUserByEmail(userEntityMock.email),
      ).rejects.toThrow(Error);
    });
  });

  describe('findUserById', () => {
    it('should return user by id', async () => {
      const user = await service.findUserById(userEntityMock.id);

      expect(user).toEqual(userEntityMock);
    });

    it('should throw when user id is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findUserById(userEntityMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw when database fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(service.findUserById(userEntityMock.id)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getUserByIdUsingRelations', () => {
    it('should return user with relations', async () => {
      const user = await service.getUserByIdUsingRelations(userEntityMock.id);

      expect(user).toEqual(userEntityMock);
    });

    it('should throw when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.getUserByIdUsingRelations(userEntityMock.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when database fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(
        service.getUserByIdUsingRelations(userEntityMock.id),
      ).rejects.toThrow(Error);
    });
  });

  describe('getAllUser', () => {
    it('should return all users', async () => {
      const users = await service.getAllUser();

      expect(users).toEqual([userEntityMock]);
    });

    it('should throw when database fails', async () => {
      jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());

      await expect(service.getAllUser()).rejects.toThrow(Error);
    });
  });

  describe('createUser', () => {
    it('should throw when email is already registered', async () => {
      jest.spyOn(service, 'findUserByEmail').mockResolvedValue(userEntityMock);

      await expect(service.createUser(createUserMock)).rejects.toThrow(
        BadGatewayException,
      );
    });

    it('should create user when email is not registered', async () => {
      jest
        .spyOn(service, 'findUserByEmail')
        .mockRejectedValue(new NotFoundException());

      const user = await service.createUser(createUserMock);

      expect(user).toEqual(userEntityMock);
    });

    it('should throw when database fails while saving user', async () => {
      jest
        .spyOn(service, 'findUserByEmail')
        .mockRejectedValue(new NotFoundException());

      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(service.createUser(createUserMock)).rejects.toThrow(Error);
    });
  });

  describe('updatePasswordUser', () => {
    it('should update user password', async () => {
      const user = await service.updatePasswordUser(
        updatePasswordMock,
        userEntityMock.id,
      );

      expect(user).toEqual(userEntityMock);
    });

    it('should throw when last password is invalid', async () => {
      await expect(
        service.updatePasswordUser(
          updatePasswordInvalidMock,
          userEntityMock.id,
        ),
      ).rejects.toThrow();
    });

    it('should throw when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updatePasswordUser(updatePasswordMock, userEntityMock.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when database fails while saving password', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(
        service.updatePasswordUser(updatePasswordMock, userEntityMock.id),
      ).rejects.toThrow(Error);
    });
  });
});
