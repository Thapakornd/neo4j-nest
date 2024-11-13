import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NEO4J_DRIVER, NEO4J_OPTIONS } from './constants/neo4j.constant';
import { Neo4jConfig } from './interface/neo4j-config.interface';
import { Neo4jService } from './neo4j.service';
import { createDriver } from './neo4j.util';

@Module({})
export class Neo4jModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      providers: [
        {
          provide: NEO4J_OPTIONS,
          useValue: config,
        },
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_OPTIONS],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }

  static forRootAsync(configProvider): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      imports: [ConfigModule],
      providers: [
        {
          provide: NEO4J_OPTIONS,
          ...configProvider,
        },
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_OPTIONS],
          useFactory: async (configProvider: Neo4jConfig) =>
            createDriver(configProvider),
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }
}
