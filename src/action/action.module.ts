import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  providers: [ActionService, JwtStrategy],
  controllers: [ActionController]
})
export class ActionModule {}
