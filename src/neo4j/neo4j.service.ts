import { Driver, QueryResult, session, Transaction } from 'neo4j-driver';

import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';

import { NEO4J_DRIVER, NEO4J_OPTIONS } from './constants/neo4j.constant';
import { Neo4jConfig } from './interface/neo4j-config.interface';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  constructor(
    @Inject(NEO4J_OPTIONS) private readonly config: Neo4jConfig,
    @Inject(NEO4J_DRIVER) private readonly driver: Driver,
  ) {}

  // Close connection after finish to prevent unnecessary allocated memory
  async onApplicationShutdown() {
    return await this.driver.close();
  }

  beginTransaction(): Transaction {
    const session = this.getWriteSession();
    return session.beginTransaction();
  }

  getReadSession() {
    return this.driver.session({
      defaultAccessMode: session.READ,
    });
  }

  getWriteSession() {
    return this.driver.session({
      defaultAccessMode: session.WRITE,
    });
  }

  async read(
    cypher: string,
    params?: Record<string, any>,
    databaseOrTransaction?: string | Transaction,
  ): Promise<QueryResult> {
    if (databaseOrTransaction instanceof Transaction) {
      return (<Transaction>databaseOrTransaction).run(cypher, params);
    }
    const session = this.getReadSession();
    return session.run(cypher, params);
  }

  async write(
    cypher: string,
    params?: Record<string, any>,
    databaseOrTransaction?: string | Transaction,
  ): Promise<QueryResult> {
    if (databaseOrTransaction instanceof Transaction) {
      return (<Transaction>databaseOrTransaction).run(cypher, params);
    }
    const session = this.getWriteSession();
    return session.run(cypher, params);
  }
}
