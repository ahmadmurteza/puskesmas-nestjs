import { Controller, UseGuards, Get, HttpCode, HttpStatus, Post, Body, Delete, Param} from '@nestjs/common';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { RecipeService } from './recipe.service';
import { CreateDto } from './dto/create.dto';
import { UpdatedDto } from './dto/update.dto';

@UseGuards(JwtGuard)
@Controller('recipe')
export class RecipeController {
    constructor (
        private recipeService: RecipeService
    ) {}

    @UseGuards(RolesGuard)
    @Roles('Doctor')
    @HttpCode(HttpStatus.OK)
    @Get('all')
    async getMe() {        
        const data = await this.recipeService.getAll();
        return {
            status: 200,
            message: "Successfully get all data",
            data
        }
    }

    @UseGuards(RolesGuard)
    @Roles('Doctor')
    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    async create(@Body() recipe: CreateDto, @GetUser() user: User) {        
        const data = await this.recipeService.create(recipe);
        return {
            status: 201,
            message: "Successfully create data",
            data
        }
    }

    @UseGuards(RolesGuard)
    @Roles('Doctor')
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('update/:id')
    async update(@Body() recipe: UpdatedDto, @Param('id') id: string) {        
        const data = await this.recipeService.update(recipe, id);
        return {
            status: 201,
            message: "Successfully updated data",
            data
        }
    }

    @UseGuards(RolesGuard)
    @Roles('Doctor')
    @HttpCode(HttpStatus.ACCEPTED)
    @Delete(':id')
    async delete(@Param('id') id: string) {        
        const data = await this.recipeService.delete(id);
        return {
            status: 201,
            message: "Successfully delete data",
            data
        }
    }
}
