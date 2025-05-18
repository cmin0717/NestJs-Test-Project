import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const server = app.getHttpServer()
  server.keepAliveTimeout = 65000
  server.headersTimeout = 66000

  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API')
    .setVersion('1.0')
    .addTag('NestJS API')
    .addSecurity('jwt', {
      type: 'http',
      scheme: 'bearer',
    })
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(3000)
}
bootstrap()
