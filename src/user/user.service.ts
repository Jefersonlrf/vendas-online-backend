import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';
import { updatePasswordDTO } from './dtos/update-password.dto';
import { createPasswordhashed, validationPassword } from '@/utils/password';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }


    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = await this.findUserByEmail(createUserDto.email).catch(() => undefined);

        if (user) {
            throw new BadGatewayException('Email registered in system');
        }

        const passwordHashed = await createPasswordhashed(createUserDto.password);

        return this.userRepository.save({
            ...createUserDto,
            typeUser: UserType.User,
            password: passwordHashed,
        });
    }

    async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
        const userrl = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: {
                addresses: {
                    city: {
                        state: true,
                    },
                },
            },
        });

        if (!userrl) {
            throw new NotFoundException('User not found');
        }
        return userrl;
    }

    async getAllUser(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async findUserById(userId: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException(`UserId ${userId} Not Found`)
        }
        return user;
    }

    async findUserByEmail(email: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new NotFoundException(`Email ${email} Not Found`)
        }

        return user;
    }

    async updatePasswordUser(updatePasswordDTO: updatePasswordDTO, userId: number): Promise<UserEntity> {
        const user = await this.findUserById(userId);

        const passwordHashed = await createPasswordhashed(updatePasswordDTO.newPassword);

        const isMatch = await validationPassword(updatePasswordDTO.lastPassword, user.password);
        
        if (!isMatch) {
            throw new BadRequestException('Last password invalid');
        }

        return this.userRepository.save({
            ...user,
            password: passwordHashed,
        })
    }
}
