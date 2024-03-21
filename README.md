<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



## Description

Nest back para api de peliculasm en la que  progresivamente se va agregando distintas funcionalidades.

## Installation

```bash
$ yarn install
```

## Ejecución de Docker-compose

Para poder conectarse a la base de datos, se debe crear un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

```bash
MONGODB_URI="mongodb://root:example@localhost:27017/dn-name"
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="example"
MONGO_DATABASE="dn-name"
MONGO_DATABASE_HOST="localhost"
MONGO_DATABASE_PORT="27017"
```

Debe crear la carpeta `./mongo` en la raíz del proyecto para que se pueda montar el volumen de la base de datos.

```bash
mkdir mongo
```

Luego, se debe correr el siguiente comando:

```bash
yarn run db:up
```

Eliminar los contenedores creados:

```bash
yarn run db:delete
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Pruebas Unitarias

```bash
# unit tests
$ yarn run test
```

Para correr solo una prueba unitaria en particular, se debe correr el siguiente comando:

```bash
# unit tests
$ jest --watch src/nombre-del-archivo.spec.ts
```

## License

Nest is [MIT licensed](LICENSE).
