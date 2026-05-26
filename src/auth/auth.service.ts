import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ReturnLogin } from './dto/returnLogin.dto';
import { ReturnUserDto } from '@/user/dtos/returnUser.dto';
import { LoginPayload } from './dto/loginPayload.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService, private jwService: JwtService) { }

    async login(loginDto: LoginDto): Promise<ReturnLogin> {
        const user = await this.userService.findUserByEmail(loginDto.email);

        if (!user) {
            throw new NotFoundException('Email invalid');
        }
        const isMatch = await compare(loginDto.password, user.password);

        if (!isMatch) {
            throw new NotFoundException('Password invalid');
        }

        const payload = new LoginPayload(user);

        return {
            accessToken: this.jwService.sign({ ...payload}),
            user: new ReturnUserDto(user),
        };
    }
}
