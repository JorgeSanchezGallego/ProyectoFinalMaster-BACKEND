# 🍽️ Proyecto Final Máster - Backend API

Este repositorio contiene el **Backend** del Proyecto Final para el curso **FullStack Developer**. Se trata de una API RESTful desarrollada con **Node.js** y **Express** para la gestión integral de un negocio de hostelería, permitiendo la administración de productos, usuarios y pedidos.

## 🏫 Información del Proyecto

* **Escuela:** Prometeo
* **Profesor:** Antonio Rosales
* **Alumno:** Jorge Sánchez
* **Tipo de Proyecto:** Backend (Node.js + MongoDB)

---

## 🚀 Tecnologías Utilizadas

Este proyecto ha sido construido utilizando las siguientes tecnologías y librerías:

* **Core:** Node.js, Express.js (v5).
* **Base de Datos:** MongoDB, Mongoose (v9).
* **Seguridad:** Bcrypt (hashing de contraseñas), JWT (Json Web Tokens).
* **Gestión de Archivos:** Multer, Cloudinary (Almacenamiento de imágenes en la nube).
* **Datos y Semillas:** CSV-Parser y sistema de archivos `fs` (Lectura de datos masivos desde Excel/CSV).
* **Middleware:** CORS, Dotenv.

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para levantar el proyecto en local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/JorgeSanchezGallego/ProyectoFinalMaster-BACKEND.git
    cd ProyectoFinalMaster-BACKEND
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```


3.  **Ejecutar el Servidor:**
    ```bash
    npm run dev
    ```

---

## 🌱 Semillas de Datos (Data Seeding)

Cumpliendo con los requisitos del proyecto, la base de datos se genera automáticamente a partir de archivos **CSV** (exportados desde Excel).

Los archivos fuente se encuentran en `src/data/`:
* `Productos.csv`: Listado de bebidas, comidas y productos de limpieza.
* `Usuarios.csv`: Usuarios iniciales con diferentes roles.

**Comando para poblar la Base de Datos:**
```bash
npm run allSeeds
```

Este script utiliza `fs` para leer los archivos y `csv-parser` para procesarlos, limpiando las colecciones existentes e insertando los nuevos registros formateados.

## 🔐 Autenticación y Roles

La API implementa un sistema de seguridad basado en roles (Middlewares propios):

* **Trabajador:** Usuario base. Solo puede ver productos.
* **Comercial (Supplier):** Puede crear, editar y eliminar productos (Gestión de inventario).
* **Encargado (Manager):** Puede realizar pedidos y consultar el historial de pedidos de la empresa.

## 📡 Endpoints Principales

### 👤 Usuarios (`/api/users`)

* `POST /register` - Registro de nuevos usuarios (incluye subida de avatar a Cloudinary).
* `POST /login` - Inicio de sesión (retorna Token Bearer).

### 📦 Productos (`/api/products`)

* `GET /` - Listar todos los productos.
* `GET /name/:nombre` - Buscar producto por nombre.
* `GET /category/:categoria` - Buscar por categoría.
* `POST /` - Crear producto (Requiere rol **Comercial** + Imagen).
* `PATCH /:id` - Editar producto (Requiere rol **Comercial**).
* `DELETE /:id` - Borrar producto (Requiere rol **Comercial**).

### 🛒 Pedidos (`/api/pedidos`)

* `POST /pedido` - Crear nuevo pedido.
    * **Nota de Seguridad:** El backend ignora el precio enviado por el usuario y busca el precio real del producto en la BBDD para evitar manipulaciones. (Requiere rol **Encargado**).
* `GET /historial` - Ver mis pedidos realizados (incluye `populate` para ver los detalles del producto).

## 🧪 Pruebas y Evidencias (Insomnia)

En la raíz del proyecto encontrarás una carpeta llamada **Insommia**.
Esta carpeta contiene capturas de pantalla que demuestran el correcto funcionamiento de los endpoints críticos, incluyendo:

* **Auth:** Login exitoso y generación de Token.
* **Pedidos:** Creación de pedido con cálculo de total y visualización del historial.
* **Upload:** Subida de imágenes a Cloudinary funcionando correctamente.

## 📂 Estructura del Proyecto

```text
/src
  ├── config/       # Conexión a DB y Cloudinary
  ├── controllers/  # Lógica de los endpoints (User, Product, Pedido)
  ├── data/         # Archivos CSV (Fuente de datos)
  ├── middlewares/  # Auth (JWT), roles y subida de archivos (Multer)
  ├── models/       # Esquemas de Mongoose
  ├── routes/       # Definición de rutas
  ├── seeds/        # Scripts de carga de datos masiva
  └── utils/        # Utilidades (Lectura CSV, Tokens, Cloudinary Delete)