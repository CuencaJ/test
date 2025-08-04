FROM node:24

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la app
COPY index.js .
COPY libros.json .
COPY test ./test

# Exponer el puerto de la aplicación
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]