# Backend - Express.js Application

Una aplicación simple en Express.js que responde "Hola mundo" en la ruta GET `/`.

## Características

- Servidor Express.js simple
- Ruta principal: `GET /` - Responde "Hola mundo"
- Health check: `GET /health` - Para verificar el estado del servicio
- Manejo de errores y rutas no encontradas
- Configuración para Docker y Kubernetes

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start
```

## Uso

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar con nodemon (desarrollo)
npm run dev

# O ejecutar directamente
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Con Docker

```bash
# Construir imagen
docker build -t backend .

# Ejecutar contenedor
docker run -p 3000:3000 backend
```

## Endpoints

- `GET /` - Ruta principal que responde "Hola mundo"
- `GET /health` - Health check del servicio

## Variables de entorno

- `PORT` - Puerto en el que se ejecutará la aplicación (por defecto: 3000)

## Estructura del proyecto

```
backend/
├── src/
│   └── main.js          # Archivo principal de la aplicación
├── package.json          # Dependencias y scripts
├── Dockerfile           # Configuración de Docker
├── .dockerignore        # Archivos a ignorar en Docker
└── README.md           # Este archivo
```
