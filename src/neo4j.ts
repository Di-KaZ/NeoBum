import Builder from '@neode/querybuilder';
import * as neo4j from 'neo4j-driver';

export const db = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '1234'));

export const mapper = <T>(record: neo4j.Record): T => {
  return { label: record.get('a').labels[0], ...record.get('a').properties };
};

export interface Album {
  label: string;
  name: string;
  cover: string;
  prodYear: number;
  price: number;
}

export const getAllAlbums = async (): Promise<Album[]> => {
  const result = await db.session().run(
    new Builder()
      .match('a', 'Album')
      .return('a')
      .toString()
  );
  return result.records.map(r => mapper<Album>(r));
};
