# Etapa 1: Instalación de dependencias
FROM node:19.5.0-alpine AS dev-deps
WORKDIR /angular

COPY package.json package-lock.json ./

RUN npm install

# Etapa 2: Construcción de la aplicación Angular
FROM node:19.5.0-alpine AS builder
WORKDIR /angular

# Copia las dependencias instaladas desde la etapa anterior
COPY --from=dev-deps /angular/node_modules /angular/node_modules

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación Angular
RUN npm run build --prod

# Etapa 3: Servir la aplicación con Nginx
FROM nginx:latest AS prod
EXPOSE 80

# Copia los archivos generados en la etapa de construcción al directorio de Nginx
COPY --from=builder /angular/dist/angular/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]