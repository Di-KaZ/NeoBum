![Logo](./github_ressources/logo.png)

## Neo4j and Sveltekit school project

#### Feature

- [x] Paginated category (albums/artists/groups)
- [x] Simple search
- [x] Advanced search with filters
- [ ] detailled views (albums/artist/groups) (not finished)
- [ ] Add more albums/artist ?

#### Some visuals

![Logo](github_ressources/logo.gif)
![Logo](github_ressources/demo_search_filter.mp4)
![Logo](github_ressources/demo_detail_artists_groups.mp4)

## How to launch

### - The easy way with Docker

Install docker and simply run `docker-compose up` in the root directory of this repo

> The website is availible on _localhost:3000_
> The Neo4j bdd is availible on _localhost:7687_ via **bolt protocol**

> ⚠ Neo4j data are not permanent in neo4j container they are re-imported at each launch

### - The hard way manually

They are two part on the project :

- WEB

  Firstly you can configure the credential of nei4j in the **.env** file located in `WEB/.env`

  > The web folder is the front you can run it in **DEV MODE** by doing
  >
  > ```bash
  > yarn install # or npm install
  > yarn dev # or npm run dev
  > ```
  >
  > It will be availible on _localhost:3000_

  > The web folder is the front you can run it in **PROD MODE** by doing :
  >
  > ```bash
  > yarn install # or npm install
  > yarn build # or npm run build
  > node dist/index.js
  > ```
  >
  > It will be availible on _localhost:3000_.

- BDD

  > Neo4j bdd can be initialized by using the cql script located in `BDD/cyphers/`.
  > It will need to have the csv files located in `BDD/neo4j/import` in the **import** foler of your neo4j instance.
  > The just run dump.cql and the data should be imported

  > ⚠ You may need to add this line in the config of your neo4j instance
  > `dbms.default_listen_address=0.0.0.0`
