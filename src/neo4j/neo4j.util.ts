import neo4j, { auth, Driver } from 'neo4j-driver';

import { Neo4jConfig } from './interface/neo4j-config.interface';

export const createDriver = async (
  configProvider: Neo4jConfig,
): Promise<Driver> => {
  const driver: Driver = neo4j.driver(
    configProvider.connectionString,
    auth.basic(configProvider.username, configProvider.password),
  );
  await driver.verifyAuthentication();
  return driver;
};
