import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly UsersService: UsersService,
        private readonly JwtService: JwtService
    ) {}

    async login(loginDto: LoginDto)
    {
        const user = await this.UsersService.findByEmailWithPassword(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { email: user.email, role: user.role };

        const token = await this.JwtService.signAsync(payload);

        return { token, email: user.email };

    }

    async register(registerDto: RegisterDto){
        const user = await this.UsersService.findOneByEmail(registerDto.email);

        if (user) {
            throw new BadRequestException('User already exists');
        }

        // Hash para la contraseña
        registerDto.password = await bcryptjs.hash(registerDto.password, 10);

        await this.UsersService.create(registerDto);

        return { name: registerDto.name, email: registerDto.email };
    }

    async profile({email, role}: {email: string, role: string}) {
        return await this.UsersService.findOneByEmail(email);
    }
}
