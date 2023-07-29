import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService, 
    ){}

    async getAll() {
        const allUser = await this.prisma.user.findMany();
        return allUser;
    }

    async findByID(id: string) {
        let intId = parseInt(id);
        const user = await this.prisma.user.findUnique({where:{id: intId}});
        return user;
    }
}
