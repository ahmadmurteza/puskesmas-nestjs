import { Injectable } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SigninDto } from "./dto/signin.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { config } from "process";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private readonly jwtService: JwtService, 
        private config: ConfigService
    ) {}

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
            delete user.id;
            return {
                status: 201,
                message: "Successfully Register",
                data: {
                    user: user
                }
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            return error.message;
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

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<string> {
        const payload = {sub: userId, email: email};
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '59m',
            secret: this.config.get('JWT_SECRET')
        });
        return accessToken;
    }
    
}
