import { Injectable } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SigninDto } from "./dto/signin.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService, private readonly jwtService: JwtService) {}

    async signup(dto: AuthDto) {
        // generate password yang di hash
        const passwordHash = await argon.hash(dto.password);
        
        // menyimpan ke database user
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash: passwordHash,
                }
            });    

            delete user.passwordHash;
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            return error;
        }
    }
    
    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        };

        const pwMatches = await argon.verify(user.passwordHash, dto.password);
        if(!pwMatches) {
            throw new ForbiddenException('Password incorrect');
        }

        const payload = {sub: user.id, username: user.fullname};
        const accessToken = await this.jwtService.signAsync(payload);

        delete user.passwordHash;
        return {
            status: 200,
            message: "Successfully Login",
            data: {
                user: user,
                jwt: accessToken
            }
        }
    }
    
}
