import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdatedDto } from './dto/update.dto';

@Injectable()
export class RecipeService {
    constructor (
        private prisma: PrismaService
    ) {}

    async getAll() {
        const datas = await this.prisma.recipe.findMany({
            include: {
                user: {
                    select: {
                        fullname: true,
                    },
                },
                
            },
        });

        const modifiedDatas = datas.map((data) => {
            return {
              recipe: data.recipe,
              doctor_name: data.user.fullname, // Menggunakan nilai "fullname" sebagai nilai "user"
            };
        });
          
        return modifiedDatas;
    }

    async create(dto: CreateDto) {
        const data = await this.prisma.recipe.create({
            data: {
                recipe: dto.recipe,
                userId: dto.user_id
            }

        });
        
        delete data.id;
        delete data.userId;
        return data;
    }

    async update(dto: UpdatedDto, id: string) {
        const intId = parseInt(id);

        const data = await this.prisma.recipe.update({
            where: {
                id: intId,
            },
            data: {
                recipe: dto.recipe,
            }

        });

        delete data.id;
        delete data.userId;
        return data;
    }

    async delete(id: string) {
        const intId = parseInt(id);

        const data = await this.prisma.recipe.delete({where: {id: intId}});

        delete data.id;
        delete data.userId;
        return data;
    }
    
}
