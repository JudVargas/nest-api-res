import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/common/enums/rol.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(6)
    password: string;
    @IsEnum(Role)
    role?: Role;
}
