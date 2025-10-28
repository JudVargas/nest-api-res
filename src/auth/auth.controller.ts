import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'supertest';
import { Roles, ROLES_KEY } from './decorators/roles.decorators';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorators';
import { ActiveUser } from 'src/common/decorators/active-user.decorators';
import type { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

interface RequestWithUser extends Request {
    user: {
        email: string;
        role: string;
    }
}


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto
    ){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(
         @Body()
        loginDto: LoginDto
    ){
        return this.authService.login(loginDto);
    }


    @Get('profile')
    @Auth(Role.DOCTOR)
    profile(@ActiveUser() user: UserActiveInterface){
        return this.authService.profile(user);
    }
}
