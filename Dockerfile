# Use uma imagem base leve do Nginx
FROM nginx:alpine

# Copie o conteúdo do diretório local para o diretório do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta 80 para tráfego HTTP
EXPOSE 80

# Comando para iniciar o Nginx quando o contêiner for executado
CMD ["nginx", "-g", "daemon off;"]
