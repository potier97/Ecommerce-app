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
NODE_ENV="development"
API_KEY="rqzekuqwl9k69gp"
JWT_SECRET="this-is-a-secret-key-123."
JWT_EXPIRATION_TIME="3600s"
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

## Pruebas E2E 

Para correr las prueba E2E, se debe correr el siguiente comando:

```bash
yarn test:e2e
```

Devuelve el reporte de las pruebas E2E de solo el cubrimiento de los controladores, asi mismo en la carpeta `coverage-e2e` se puede encontrar el reporte de las pruebas E2E, esta carpeta esta siendo ignorada por el archivo `.gitignore`.



## Construir Imagen Docker

 - ENVIRONMENT_NAME -> Nombre del entorno que se desea construir (test, dev, prod)

```bash
$  docker build --build-arg ENVIRONMENT_NAME=test -t movie-app-test .
```

## Correr Imagen Docker

Correr docker, se deben pasar las variables de entorno del archivo .env dado que se ignoran en el archivo Dockerfile.

```bash
$ docker run -e PM2_PUBLIC_KEY=rqzekuqwl9k69gp -e PM2_SECRET_KEY=xxx -e MONGODB_URI=xxx -e MONGO_INITDB_ROOT_USERNAME=xxx -e MONGO_INITDB_ROOT_PASSWORD=xxx -e MONGO_DATABASE=xxx -e MONGO_DATABASE_HOST=xxx -e MONGO_DATABASE_PORT=xxx  -p 3000:3000  --name mongonest-app movie-app-test
```
 Para correr en segundo plano, se debe añadir el flag `-d` al comando anterior.

## PM2

Para correr la aplicación con PM2, se debe correr el siguiente comando:

```bash
$ pm2 start dist/main.js --name movie-app
```
O pasando el `.yml` de configuración:

```bash
$ pm2-runtime process.yml 
```
Ejecución de PM2 en modo de desarrollo:

<div align="center">
  <img src="./public/pm2.png" alt="pm2-dev" border="0">
</div>

## Apis

Para el consumo de las apis debe enviar el `x-api-key` en el header de la petición, además este debe ser incluido en las variables de entorno del archivo `.env`.

 > Ejemplo: 

```bash
API_KEY="rqzekuqwl9k69gp"
```

## Seguridad JWT

Para el consumo de las apis privadas debe enviar el `Authorization` en el header de la petición, además este debe ser incluido en las variables de entorno del archivo `.env`.

 > Ejemplo: 

```bash
JWT_SECRET="secret-key-123"
JWT_EXPIRATION_TIME="20h"
```


## Refresh Token

Para el consumo de las apis privadas debe enviar el `Authorization` en el header de la petición, además este debe ser incluido en las variables de entorno del archivo `.env`.

 > Ejemplo: 

```bash
JWT_REFRESH_SECRET="refresh-secret-key-123"
JWT_REFRESH_EXPIRATION_TIME="1h"
```


## License

Nest is [MIT licensed](LICENSE).
