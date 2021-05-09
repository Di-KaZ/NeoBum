import Builder, * as querybuilder from '@neode/querybuilder';
import * as neo4j from 'neo4j-driver';
import type { AlbumProperties } from './types/Album';
import type { ArtistProperties } from './types/Artist';
import type { GroupProperties } from './types/Group';
import type { IntrumentProprieties } from './types/Instruments';
import type { PaysProperties } from './types/Pays';
import type { StyleProperties } from './types/Style';

let db = null;

/**
 * Init Neo4j db (fix because svletekit prod build is wierd...or am I ? 🤔)
 * @returns
 */
export const initDb = (): void => {
  if (db) return;
  db = neo4j.driver(
    import.meta.env.VITE_NEO4J_URL,
    neo4j.auth.basic(import.meta.env.VITE_NEO4J_USERNAME, import.meta.env.VITE_NEO4J_PASSWORD)
  );
};

type nodeTypes =
  | AlbumProperties
  | StyleProperties
  | ArtistProperties
  | GroupProperties
  | PaysProperties
  | IntrumentProprieties;

/**
 * Convert a record into its typed conterpart
 * @param record neo4j record
 * @returns
 */
export const mapper = <nodeTypes>(record: neo4j.Record): nodeTypes => {
  return { label: record.get('res').labels[0], ...record.get('res').properties };
};

/**
 * get a page of albums
 * @param page page wanted
 * @param pageSize size of one page
 * @returns
 */
export const getPage = async (
  label: Label,
  page = 1,
  pageSize = 14,
  props = { name: '' }
): Promise<nodeTypes[]> => {
  const builder = new Builder().match('res', label);

  // add search by name
  if (props.name !== null && props.name !== '') {
    builder
      .with('toLower(res.name) as lower_name, res')
      .whereContains('lower_name', props.name.toLowerCase());
  }
  builder
    .return('res')
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  const { cypher, params } = builder.build();
  console.log(cypher, params);

  const result = await db.session().run(cypher, params);
  return result.records.map((r: neo4j.Record) => mapper<nodeTypes>(r));
};

/**
 * Find a single node in the database
 * @param label label of node
 * @param identifier identifier of node
 * @param value value of the identifier
 * @returns node
 */
export const getById = async <nodeTypes>(label: Label, value: number): Promise<nodeTypes> => {
  const { cypher, params } = new Builder()
    .match('res', label)
    .where(`res.id`, value)
    .return('res')
    .limit(1)
    .build();
  const result = await db.session().run(cypher, params);
  return mapper<nodeTypes>(result.records[0]);
};

export const getAlbumStyle = async (album: AlbumProperties): Promise<StyleProperties> => {
  const { cypher, params } = new Builder()
    .match('a', 'Album', { id: album.id })
    .relationship('HAS_MADE', querybuilder.Direction.INCOMING)
    .to('art')
    .relationship('HAS_STYLE', querybuilder.Direction.OUTGOING)
    .to('res', 'Style')
    .return('res')
    .build();
  const result = await db.session().run(cypher, params);
  return mapper<StyleProperties>(result.records[0]);
};

export const getAlbumGroupOrArtist = async (album: AlbumProperties): Promise<StyleProperties> => {
  const { cypher, params } = new Builder()
    .match('a', 'Album', { id: album.id })
    .relationship('HAS_MADE', querybuilder.Direction.INCOMING)
    .to('res')
    .return('res')
    .build();
  const result = await db.session().run(cypher, params);
  return mapper<StyleProperties>(result.records[0]);
};

export const getArtistPays = async (artist: ArtistProperties): Promise<PaysProperties> => {
  const { cypher, params } = new Builder()
    .match('a', 'Artist', { id: artist.id })
    .relationship('HAIL_FROM', querybuilder.Direction.OUTGOING)
    .to('res')
    .return('res')
    .build();
  const result = await db.session().run(cypher, params);
  return mapper<PaysProperties>(result.records[0]);
};

export const getGroupStyle = async (group: GroupProperties): Promise<StyleProperties> => {
  const { cypher, params } = new Builder()
    .match('a', 'Artist', { id: group.id })
    .relationship('HAS_STYLE', querybuilder.Direction.OUTGOING)
    .to('res')
    .return('res')
    .build();
  const result = await db.session().run(cypher, params);
  return mapper<StyleProperties>(result.records[0]);
};

export const getGroupPays = async (group: ArtistProperties): Promise<PaysProperties> => {
  const { cypher, params } = new Builder()
    .match('a', 'Group', { id: group.id })
    .relationship('HAIL_FROM', querybuilder.Direction.OUTGOING)
    .to('res')
    .return('res')
    .build();
  const result = await db.session().run(cypher, params);
  return mapper<PaysProperties>(result.records[0]);
};

export const getArtistStyle = async (artist: GroupProperties): Promise<StyleProperties> => {
  const { cypher, params } = new Builder()
    .match('a', 'Group', { id: artist.id })
    .relationship('HAS_STYLE', querybuilder.Direction.OUTGOING)
    .to('res')
    .return('res')
    .build();
  const result = await db.session().run(cypher, params);
  return mapper<StyleProperties>(result.records[0]);
};
