import Builder, * as querybuilder from '@neode/querybuilder';
import * as neo4j from 'neo4j-driver';
import type { AlbumProperties } from './types/Album';
import type { ArtistProperties } from './types/Artist';
import type { GroupProperties } from './types/Group';
import type { IntrumentProprieties } from './types/Instruments';
import type { PaysProperties } from './types/Pays';
import type { StyleProperties } from './types/Style';

export const db = neo4j.driver(
  import.meta.env.VITE_NEO4J_URL,
  neo4j.auth.basic(import.meta.env.VITE_NEO4J_USERNAME, import.meta.env.VITE_NEO4J_PASSWORD)
);

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
export const getPage = async (label: Label, page = 1, pageSize = 14): Promise<nodeTypes[]> => {
  const result = await db.session().run(
    new Builder()
      .match('res', label)
      .return('res')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toString()
  );
  return result.records.map((r) => mapper<nodeTypes>(r));
};

/**
 * Find a single node in the database
 * @param label label of node
 * @param identifier identifier of node
 * @param value value of the identifier
 * @returns node
 */
export const getOne = async <nodeTypes>({
  label,
  identifier,
  value
}: {
  label: Label;
  identifier: string;
  value: string;
}): Promise<nodeTypes> => {
  const result = await db
    .session()
    .run(
      new Builder()
        .match('res', label)
        .where(`res.${identifier}`, value)
        .return('res')
        .limit(1)
        .toString()
    );
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
