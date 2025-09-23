# Aplicación de Productos Financieros

Esta es una aplicación web en Angular que implementa un CRUD (Crear, Leer, Actualizar, Eliminar) para productos financieros.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.17.

# Requisitos Previos

Asegúrate de tener instalado lo siguiente:

- Node.js y npm (versión 22 o superior).
- Angular CLI (versión 19)

# Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/santi507/SantiagoRios.git
```

2. Navega a la carpeta del proyecto.

```bash
cd SantiagoRios
```

3. Instala las dependencias del proyecto.

```bash
npm install
```

## Ejecución del Proyecto

Para ejecutar la aplicación en modo de desarrollo, es necesario que el servicio de backend en Node.js esté corriendo en el puerto **3002**.

### Manejo de CORS con Proxy

Este proyecto utiliza un proxy de desarrollo para evitar errores de CORS. El archivo _proxy.conf.json_ redirige todas las solicitudes al backend de Node.js, asegurando una comunicación fluida entre ambos servidores locales.

Para iniciar la aplicación, usa el siguiente comando:

```bash
ng serve --proxy-config proxy.conf.json
```

Abrir una ventana en el navegador y colocar la siguiente ruta http://localhost:4200/.

## Ejecución de Pruebas

El proyecto incluye pruebas unitarias con Jest y un requisito de cobertura mínima del **70%**.

### Ejecutar todas las pruebas

Para correr todas las pruebas unitarias de los componentes y servicios, usa el siguiente comando:

```bash
npm run test
```

### Generar Informe de Cobertura

Para ejecutar las pruebas y generar un informe de cobertura detallado, usa:

```bash
npm run test:coverage
```
