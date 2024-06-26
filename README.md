<p align="center">
  <a href="http://nipoanz.com/" target="blank"><img src="./public/logo.png" width="300" alt="NPA Logo" /></a>
</p>

<!-- Alinear -->
<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/badge/NestJS-v7.6.15-red" alt="NestJS" /></a>
  <a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://img.shields.io/badge/Mongoose-v5.10.17-blue" alt="Mongoose" /></a>
  <a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v4.0.3-blue" alt="TypeScript" /></a>
  <a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://img.shields.io/badge/Jest-v26.6.3-blue" alt="Jest" /></a>
  <a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://img.shields.io/badge/Docker-v20.10.2-blue" alt="Docker" /></a>
  <a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://img.shields.io/badge/PM2-v4.5.6-blue" alt="PM2" /></a>
  <a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://img.shields.io/badge/NodeJS-v14.15.4-blue" alt="NodeJS" /></a>
  <a href="https://www.npmjs.com/package/mongoose" target="_blank"><img src="https://img.shields.io/badge/MongoDB-v4.4.3-blue" alt="MongoDB" /></a>
  <br>
<a href="https://www.nipoanz.com" target="_blank"><img src="https://img.shields.io/website?url=https%3A%2F%2Fnipoanz.com&up_message=NPA&up_color=white&down_color=red&labelColor=%2333aa9a&color=%23335566" alt="Nipoanz" /></a>
</p>
 



## Description

Nest back para api de un E-COMMERCE, el cual se encarga de gestionar la información de los productos, categorías, usuarios, roles, permisos, entre otros. Ademas de hacer el proceso de autenticación y autorización de los usuarios.

Puede comprar, añadiendo productos al carrito de compras, y realizar el proceso de pago, además de obtener el recibo de la compra.

Asi mismo puede hacer compras

## Installation

```bash
$ yarn install
```

## Ejecución de Docker-compose

Para poder conectarse a la base de datos, se debe crear un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

```bash
NODE_ENV="development"
API_KEY="XXXXXXXXXXXXXXXXXXX"
JWT_SECRET="XXXXXX-789"
JWT_EXPIRATION_TIME="3600s"
JWT_REFRESH_SECRET="XXXXXX-123"
JWT_REFRESH_EXPIRATION_TIME="30m"
JWT_REFRESH_KEY="XXXXXX-456"
MONGODB_URI="mongodb://root:example@localhost:27017/dn-name"
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="example"
MONGO_DATABASE="dn-name"
MONGO_DATABASE_HOST="localhost"
MONGO_DATABASE_PORT="27017"
#SI QUIERE USAR PM2
PM2_PUBLIC_KEY="XXX"
PM2_SECRET_KEY="XXX"
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
$  docker build --build-arg ENVIRONMENT_NAME=test -t mongo-app .
```

## Correr Imagen Docker

Correr docker, se deben pasar las variables de entorno del archivo .env dado que se ignoran en el archivo Dockerfile.

```bash
$ docker run -e PM2_PUBLIC_KEY=xxx -e PM2_SECRET_KEY=xxx -e MONGODB_URI=xxx -e MONGO_INITDB_ROOT_USERNAME=xxx -e MONGO_INITDB_ROOT_PASSWORD=xxx -e MONGO_DATABASE=xxx -e MONGO_DATABASE_HOST=xxx -e MONGO_DATABASE_PORT=xxx  -e NODE_ENV=development -e API_KEY=xxx -e JWT_SECRET=xxx -e JWT_EXPIRATION_TIME=xxx -e JWT_REFRESH_SECRET=xxx -e JWT_REFRESH_EXPIRATION_TIME=xxx -e JWT_REFRESH_KEY=xxx -e RESEND_API_KEY=xxx -e EMAIL_SENDER=xxx -p 3000:3000  --name mongonest-app mongo-app
```
 Para correr en segundo plano, se debe añadir el flag `-d` al comando anterior.

 > Recuerde que si ya existe un contenedor con el mismo nombre, debe eliminarlo antes de correr el comando anterior, o sino puede campiar el nombre del contenedor a lanzar

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

## Email
 
Se hace uso de `Resend` para el envio de correos, se cuenta con una blacklist que es manejada con un archivo de constantes.

El correo se utiliza para la validación de nuevos usuarios, cambio de contraseña, envio de notificaciones /o errores, entre otros. 



## PDF - Recibo de Compra

Ejemplo de recibo de compra en formato PDF:

<div align="center">
  <img src="./public/recibo.png" alt="pdf" border="0">
</div>
<br>
<br>

 > Descargue el ejemplo de recibo de compra en formato PDF [aquí](./public/2024230-6608e2c837a8606b92222f45.pdf).

 ## PDF - Plan de Pagos

Ejemplo de plan de pagos de una compra a 36 cuotas con interes del 10% EA en formato PDF:

<div align="center">
  <img src="./public/plan.png" alt="pdf" border="0">
</div>
<br>
<br>

 > Descargue el ejemplo del plan de pago a cuotas en el siguiente link [aquí](./public/payment-plan-660c480862882b1c4905dc98.pdf).


## License

Nest is [MIT licensed](LICENSE).
