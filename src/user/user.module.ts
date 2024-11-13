import { Neo4jModule } from 'src/neo4j/neo4j.module';

import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [Neo4jModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
