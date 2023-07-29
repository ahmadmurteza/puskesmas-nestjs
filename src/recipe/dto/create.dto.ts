import { Poli, Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDto {
    @IsString()
    @IsNotEmpty()
    recipe: string

    @IsNumber()
    @IsNotEmpty()
    user_id: number

}