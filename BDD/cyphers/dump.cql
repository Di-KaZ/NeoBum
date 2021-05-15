// Not optimized at all but its to get the idea of what I wanted to do 😁

// Import styles
LOAD CSV WITH HEADERS FROM 'file:///styles.csv' AS row
MERGE (s:Style {name: row.name})

WITH count(*) as dummy // fix multtple statement query not allowd in dokcer...


// Import pays

LOAD CSV WITH HEADERS FROM 'file:///pays.csv' AS row
MERGE (s:Pays {name: row.name})

WITH count(*) as dummy // fix multtple statement query not allowd in dokcer...



// imports instruments
LOAD CSV WITH HEADERS FROM 'file:///instruments.csv' AS row
MERGE (s:Instrument {name: row.name})

WITH count(*) as dummy // fix multtple statement query not allowd in dokcer...



// imports artists (groups)
LOAD CSV WITH HEADERS FROM 'file:///artists.csv' AS row
WITH row WHERE row.type = "G"
MATCH (s:Style {name: row.style})
MATCH (p:Pays {name: row.pays})
MERGE (a:Group {id: row.id})
SET a.name = row.name
MERGE (a)-[:HAS_STYLE]->(s)
MERGE (a)-[:HAIL_FROM]->(p)

WITH count(*) as dummy // fix multtple statement query not allowd in dokcer...
 // fix multtple statement query not allowd in dokcer...

// imports artists (singer)

LOAD CSV WITH HEADERS FROM 'file:///artists.csv' AS row
WITH row WHERE  row.type = "S"
MATCH (s:Style {name: row.style})
MATCH (p:Pays {name: row.pays})
MERGE (a:Artist {id: row.id})
SET a.name = row.name
MERGE (a)-[:HAS_STYLE]->(s)
MERGE (a)-[:HAIL_FROM]->(p)

WITH count(*) as dummy // fix multtple statement query not allowd in dokcer...


// imports artists (musician)

LOAD CSV WITH HEADERS FROM 'file:///musicians.csv' AS row
MATCH (p:Pays {name: row.pays})
MATCH (i:Instrument {name: row.ins})
MATCH (grp:Group {id: row.grpId})
MERGE (a:Artist {id: row.id})
SET a.name = row.name
MERGE (a)-[:HAIL_FROM]->(p)
MERGE (a)-[:PLAY]->(i)
MERGE (a)<-[:COMPOSED_OF]-(grp)

WITH count(*) as dummy // fix multtple statement query not allowd in dokcer...


// Imports  albums
LOAD CSV WITH HEADERS FROM 'file:///albums.csv' AS row
MATCH (art) WHERE (art:Artist OR art:Group) AND art.id = row.atristId
MERGE (a:Album {id: toInteger(row.id)})
SET a.name = row.name
SET a.prodYear = toInteger(row.prodYear)
SET a.price = toFloat(row.price)
MERGE (a)<-[:HAS_MADE]-(art);