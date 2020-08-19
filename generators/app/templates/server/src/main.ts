import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException, ValidationPipe} from '@nestjs/common';
import {AuthGuard} from './auth/guards/auth.guard';
import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs';
import {resolve} from 'path';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (request.url.indexOf('/api') > -1) {
            response.status(404).send({statusCode: 404, message: `${request.method} ${request.url} Not Found`});
        } else {
            const staticAssetsPath = path.join(__dirname, '../../client/build/resources/main/static/index.html');
            if (fs.existsSync(staticAssetsPath)) {
                response.sendFile(resolve(staticAssetsPath));
            }
        }
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    app.useGlobalPipes(new ValidationPipe());
    const staticAssetsPath = path.join(__dirname, '../../client/build/resources/main/static');
    if (fs.existsSync(staticAssetsPath)) {
        app.use(express.static(staticAssetsPath));
    }
    app.useGlobalFilters(new NotFoundExceptionFilter());
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new AuthGuard(reflector));
    await app.listen(port);
}

bootstrap();
