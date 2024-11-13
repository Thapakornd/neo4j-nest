export type Neo4jScheme =
  | 'neo4j'
  | 'neo4j+s'
  | 'neo4j+ssc'
  | 'bolt'
  | 'bolt+s'
  | 'bolt+ssc';

export interface Neo4jConfig {
  username: string;
  password: string;
  connectionString: string;
}
