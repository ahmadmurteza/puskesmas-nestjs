import { Poli, Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role

    @IsString()
    @IsNotEmpty()
    fullname: string

    @IsEnum(Poli)
    @IsNotEmpty()
    poli: Poli

}