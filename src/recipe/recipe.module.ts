import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  providers: [RecipeService, JwtStrategy],
  controllers: [RecipeController]
})
export class RecipeModule {}
