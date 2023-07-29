import { Injectable } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SigninDto } from "./dto/signin.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private readonly jwtService: JwtService, 
        private config: ConfigService
    ) {}

    async signup(dto: AuthDto) {
        const passwordHash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash: passwordHash,
                    fullname: dto.fullname,
                    role: dto.role,
                    poli: dto.poli,
                }
            }); 
               
            
            const accessToken = await this.signToken(user.id, user.email, user.role);
            
            delete user.updatedAt;
            delete user.createdAt;
            delete user.passwordHash;
            delete user.id;

            const response = {
                user: user,
                access_token: accessToken,
            }
            
            return response;
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

        return this.signToken(user.id, user.email, user.role);
    }

    async signToken(userId: number, email: string, role: string): Promise<string> {
        const payload = {sub: userId, email: email, role: role};
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15h',
            secret: this.config.get('JWT_SECRET')
        });
        return accessToken;
    }
    
}
