import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        });
    }

    async cleanDatabase() {
        if (this.config.get('APP_DEBUG') == 'production') return;
        const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
        return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
    }
}
