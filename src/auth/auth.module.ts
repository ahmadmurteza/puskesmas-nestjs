import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt/dist";
import { JwtStrategy } from "./strategy";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [JwtModule.register({}), PrismaModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})

export class AuthModule {}