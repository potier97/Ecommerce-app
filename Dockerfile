# AMBIENTE DE DESARROLLO
FROM node:14-alpine AS development
# CONTROLAR EL TAMAÑO MAXIMO DE LA IMAGEN NODE
ENV NODE_OPTIONS=--max_old_space_size=8192 
#GENERAR LA RUTA DE TRABAJO
WORKDIR /app
# COPIAR package.json PRIMERO
COPY package.json /app/
# DESACTIVAR LA BARRA DE PROGRESO
RUN npm set progress=false && npm config set depth 0 
# INSTALAR DEPENDENCIA GLOBAL
RUN npm install -g ansi-styles rimraf
# INSTALAR TODAS LAS DEPENDENCIAS
RUN npm install
# COPIAR DE LA CARPETA DEL PROYECTO AL CONTENEDOR
COPY . /app
# CONSTRUIR EL PROYECTO
RUN npm run build

# # AMBIENTE DE PRODUCCION
FROM node:14-alpine AS production
# ENTORNO DE DESARROLLO
ARG ENVIRONMENT_NAME=dev
ENV ENVIRONMENT_NAME $ENVIRONMENT_NAME
# CONTROLAR EL TAMAÑO MAXIMO DE LA IMAGEN NODE
ENV NODE_OPTIONS=--max_old_space_size=8192 
# # --no-cache: download package index on-the-fly, no need to cleanup afterwards
# # --virtual: bundle packages, remove whole bundle at once, when done
# RUN apk --no-cache --virtual build-dependencies add nginx supervisor prometheus
RUN apk --no-cache --virtual build-dependencies add nginx supervisor
# # COPIAR LOS TIPOS  DE CONFIGURACIONES
COPY /config/mime-custom.types /etc/nginx/mime.types
# # COPIAR LA CONFIGURACIÓN DEL SERVIDOR DE NGINX
COPY /config/nginx-custom.conf /etc/nginx/nginx.conf
# # COPIAR LA CONFIGURACIÓN DEL PROMETHEUS PARA NGINX
# COPY /config/prometheus/prometheus.yml /etc/prometheus/prometheus.yml
#GENERAR LA RUTA DE TRABAJO
WORKDIR /app
# COPIAR package.json PRIMERO
COPY package.json /app/
#DESACTIVAR LA BARRA DE PROGRESO
RUN npm set progress=false && npm config set depth 0 
# INSTALAR SOLO DEPENDENCIAS DE PRODUCCION
# # RUN npm install --production
# RUN npm install -D --force
RUN npm install --force
# RUN npm install @nestjs/cli @nestjs/schematics dotenv
# INSTALAR DEPENDENCIA GLOBAL
# RUN npm install -g pm2 ansi-styles rimraf ajv
RUN npm install -g pm2 
# # COPIAR DE AMBIENTE DE DESARROLLO
COPY --from=development /app/dist /app/dist
# # PERMISOS DE EJECUCION
RUN chmod +x -R /app/dist
# # SE COPIA ARCHIVO DE CONFIGURACION DE PM2
COPY config/pm2/process.yml /app/
# # COPIAR ARCHIVOS DE CONFIGURACION DE SUPERVISOR 
COPY config/supervisord/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# # CAMBIO DE LA ZONA HORARIA
ENV TZ=America/Bogota
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# # COPIA DE VARIABLES DE ENTORNO - TEST
# COPY .local.env /app/.env
# # PUERTO DE ACCESO PARA EL ENLACE DE SERVIDOR NODEJS
# EXPOSE 3002
# # PUERTO DE ACCESO PARA EL PROXY INVERSO DE NGINX
EXPOSE 3000
EXPOSE 3535
# # ACCESO PROMETHEUS
# EXPOSE 9090
# # LLAVES PUBLICA DE PM2
ENV PM2_PUBLIC_KEY rqzekuqwl9k69gp
# # LLAVES SECRETA DE PM2
ENV PM2_SECRET_KEY 4u635vuudevibh2
# # VARAIBLES PARA DATADOG
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
# # CONTENEDOR TEST - express ejemplo
# CMD ["pm2-runtime", "process.yml", "--only", "spresstest"]
# # CONTENEDOR TEST - backend
# CMD ["pm2-runtime", "process.yml", "--only", "tatback"]
