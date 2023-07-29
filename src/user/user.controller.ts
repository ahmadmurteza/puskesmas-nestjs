import { Controller, Get, UseGuards, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor (private userService: UserService) {}

    @HttpCode(HttpStatus.OK)
    @Get('me')
    getMe(@GetUser() user: User) {        
        return user;
    }

    @HttpCode(HttpStatus.OK)
    @Get('all')
    async getAll() {     
        const data = await this.userService.getAll();
        return {
            status: 200,
            message: "Successfully get all data",
            data
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async getById(
        @Param('id') id: string
    ) {
        const data = await this.userService.findByID(id);
        return {
            status: 200,
            message: "Successfully get data by id",
            data
        }
    }
}
