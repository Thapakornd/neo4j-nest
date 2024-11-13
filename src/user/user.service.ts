import { randomBytes } from 'crypto';
import { QueryResult } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';

import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

  private hydrate(res: QueryResult): User {
    if (!res.records.length) {
      return undefined;
    }
    const user = res.records[0].get('u');
    return new User(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const res = await this.neo4jService.read(
      `
            MATCH (u:User {email: $email})
            RETURN u
            `,
      { email },
    );
    return this.hydrate(res);
  }

  async create(
    email: string,
    pass: string,
    firstName: string,
    lastName: string,
    invitedCode: string,
  ) {
    const code = randomBytes(8).toString('base64');
    const res = await this.neo4jService.write(
      `
            MATCH (p:User {code: $invitedCode})
            CREATE (u:User)
            SET u += $properties, u.id = randomUUID()
            WITH u, p
            WHERE u.invitedCode <> ''
            CREATE (p)-[:PARENT_ID]->(u)
            RETURN u
        `,
      {
        invitedCode: invitedCode,
        properties: {
          email,
          pass,
          firstName,
          lastName,
          code,
          invitedCode,
        },
      },
    );
    return this.hydrate(res);
  }

  async getChildren(id: string) {
    const res = await this.neo4jService.read(
      `
        MATCH ( t:User {id: $id})
        OPTIONAL MATCH path = (t)-[:PARENT_ID*]->(subUser: User)
        WITH collect(path) as paths
        CALL apoc.convert.toTree(paths, true, { nodes: { User: ['firstName']}}) YIELD value
        RETURN value as tree
      `,
      {
        id,
      },
    );
    return res;
  }
}
