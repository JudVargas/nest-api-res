# ==============================
# Etapa 1: Construcción
# ==============================
FROM node:22-bullseye AS builder


WORKDIR /usr/src/app

# Copiar dependencias
COPY package*.json ./

# Instalar npm estable
# RUN npm install -g npm@10.8.2

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar el proyecto
RUN npm run build

# ==============================
# Etapa 2: Ejecución
# ==============================
FROM node:22-bullseye


WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
