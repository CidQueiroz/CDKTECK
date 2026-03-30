# Estágio de Build
FROM node:20-alpine AS builder

# Argumento para o token do GitHub (necessário para pacotes privados no .npmrc)
ARG NODE_AUTH_TOKEN

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração de dependências
COPY package*.json .npmrc ./

# Configurar o token e instalar dependências
# Usamos --legacy-peer-deps para resolver conflitos de peer dependencies do React 19
ENV NODE_AUTH_TOKEN=$NODE_AUTH_TOKEN
RUN npm install

# Copiar o restante do código fonte
COPY . .

# Executar o build (o output: 'export' no next.config.mjs gerará a pasta 'out')
RUN npm run build

# Estágio de Produção (Servidor Web)
FROM nginx:alpine

# Copiar o build estático do estágio anterior para o diretório do Nginx
COPY --from=builder /app/out /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
