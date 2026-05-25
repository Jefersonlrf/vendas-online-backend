import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService) { }

    async login(loginDto: LoginDto): Promise<UserEntity> {
        const user = await this.userService.findUserByEmail(loginDto.email);

        if (!user) {
            throw new NotFoundException('Email invalid');
        }
        const isMatch = await compare(loginDto.password, user.password);

        if (!isMatch) {
            throw new NotFoundException('Password invalid');
        }

        return user;
    }
}
