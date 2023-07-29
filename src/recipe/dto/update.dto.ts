import { Poli, Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdatedDto {
    @IsString()
    @IsNotEmpty()
    recipe: string

}