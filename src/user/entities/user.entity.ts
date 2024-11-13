import { Node } from 'neo4j-driver';

export class User {
  constructor(private readonly node: Node) {}

  getId(): string {
    return (<Record<string, any>>this.node.properties).id;
  }

  getCode(): string {
    return (<Record<string, any>>this.node.properties).code;
  }

  getEmail(): string {
    return (<Record<string, any>>this.node.properties).email;
  }

  getPassword(): string {
    return (<Record<string, any>>this.node.properties).pass;
  }

  toJSON(): Record<string, any> {
    const { id, email, firstName, lastName, code, username } = <
      Record<string, any>
    >this.node.properties;
    return { id, email, firstName, lastName, code, username };
  }
}
