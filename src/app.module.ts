import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoorkmarkModule } from './boorkmark/boorkmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports:[
    AuthModule, 
    UserModule, 
    BoorkmarkModule, 
    PrismaModule,
  ],
})

export class AppModule {}
