import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';
import { SessionSerializer } from './auth/utils/session-serializer';
import { Neo4jConfig } from './neo4j/interface/neo4j-config.interface';
import { Neo4jModule } from './neo4j/neo4j.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PassportModule.register({
      session: true,
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        connectionString: configService.get('NEO4J_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
    SessionSerializer,
  ],
})
export class AppModule {}
