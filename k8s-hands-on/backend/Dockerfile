# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar código fuente
COPY src/ ./src/

# Exponer puerto
EXPOSE 3000

# Variable de entorno para el puerto
ENV PORT=3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"] 