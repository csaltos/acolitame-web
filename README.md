# Acolitame-web

Este repositorio contiene una aplicación en NodeJS y ExpressJS que servirá como capa de negocio y capa de vista para la página web del proyecto Acolitame.

Además este repositorio contiene los archivos de configuración (variables de entorno, etc.) para el proyecto Acolitame.

## Antes de Ejecutar

Asegurese de tener instalado lo siguiente, las versiones listadas son las versiones en las que se hicieron pruebas.

- NodeJS v12.18.3.
- NPM 6.14.6.

Tambien es necesario:

- Cambiar todos los *localhost* por el nombre del dominio
- Si se desea, cambiar la variable *PORT* en el archivo `.env`.
- Cambiar las credenciales para conexion con base de datos PostgreSQL en `.env`.
- Agregar credenciales para Login OAuth 2.0 con Google y Facebook en `.env`, estas credenciales deben estar previamente configuradas en los servicios respectivos de cada plataforma.

## Pasos para Ejecutar

### Como aplicacion independiente

1. Clonar o descargar este repositorio y ejecutar `npm install` para instalar las dependencias.
2. Ejecutar `npm start` para iniciar el servidor.

### Como contenedor de docker

Dentro del repositorio se encuentra un `Dockerfile` el cual permite la creacion de una imagen de docker para ejecutar la aplicacion, los pasos son los siguientes:

1. Instalar docker si no se tiene ya instalado .
2. Dentro del `Dockerfile` cambiar el valor de *EXPOSE* para que sea el mismo que la variable *PORT* dentro del archivo `.env`.
3. Ejecutar `docker build -t yourname .`, siendo `yourname` el nombre que se le asignara a la imagen de docker. Esto creara la imagen de docker que se utilizara para la ejecucion.
4. Ejecutar `docker run -dp 8080:PORT --name containerName yourname` para ejecutar un contenedor de docker con la imagen previamente creada. Siendo por el valor configurado de *EXPOSE* dentro de `Dockerfile`.

## Consideraciones de Variables de Entorno

- Se utiliza el logger `morgan` para visualizar los estados de peticiones HTTP por consola. En modo `development` se hacen logs de tipo `dev` para todas las peticiones en la consola, mientras que en modo `production` los logs son de tipo `combined` para las peticiones con códigos de error mayor a 400 únicamente y se guardan en archivos de tipo `logs/http-morgan/http-errors.log`, estos archivos se rotan diariamente, con un máximo de 9 archivos.
- Se utiliza el logger `debug` para motivos de depuración por consola en desarollo. Para poder visualizar los logs de `debug` se debe incializar la variable de entorno `DEBUG` a `acolitame-web:*` o a `acolitame-web:*,memorystore` en caso de que se requieran logs con datos de sesiones. Definir `DEBUG` como una cadena vacía para no mostrar nada (para producción).
- Se utiliza el logger `winston` para mostrar logs de errores de la app. Para `NODE_ENV` en modo `development` los logs se muestran en consola. Para `NODE_ENV` en modo `production` los logs se guardan en archivos de tipo `logs/app-winston/app-errors.log`, estos archivos se rotan diariamente, con un máximo de 9 archivos.

## Consideraciones sobre `public/`

- En la carpeta `public` se almacenan ciertos recursos iniciales para la página web (imágenes, etc.)

## Sobre la API para la página web

Para acceder al código de la API para la página web dirigirse a:

## Autores

- Berenice Guerrero
- Marcelo Peñafiel
- Daniel Seaman (Ver historia de commits para ver contribuciones)

Estudiantes de Ingeniería en Sistemas de la Facultad de Ingeniería de la Universidad de Cuenca.
