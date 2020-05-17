import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {User} from '../user/user.model';
import {Authority} from '../user/authority/authority.entity';
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER} from '../app.constants';
import {ENTITIES} from '../entity/entity.constants';

export const DATABASE_CONFIG_OPTIONS: TypeOrmModuleOptions = {
    type: 'mysql',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [...ENTITIES],
    synchronize: true,
};
