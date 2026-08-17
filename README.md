# Sistema Web de Gestion de Incidencias

Demostracion minima funcional desarrollada para la Actividad de Evaluacion - Unidad III
(Desarrollo Web Integral). Permite a los usuarios iniciar sesion, registrar incidencias
y consultar su estado; los administradores pueden actualizar y cerrar incidencias.

**Equipo:** Sanchez Reyes Aylin Magdalena, Chavez Urbina Luis Alfonso — Grupo IDSW31

## Stack tecnologico

- **Backend:** Node.js + Express, JWT para autenticacion, bcryptjs para hash de
  contrasenas, almacenamiento en archivo JSON (`backend/data/db.json`).
- **Frontend:** HTML, CSS y JavaScript (vanilla), consumo de la API con `fetch`.
- **API externa:** [ipwho.is](https://ipwho.is) — geolocalizacion por IP, usada para
  registrar automaticamente la ubicacion de origen de cada incidencia.

## Estructura del repositorio

```
proyecto-gestion-incidencias/
  backend/          API REST (Express)
    data/            Persistencia en JSON (usuarios e incidencias)
    middleware/       Autenticacion (JWT) y validacion de datos
    routes/           Endpoints de auth e incidencias
    server.js         Punto de entrada del servidor
  frontend/          Cliente web (HTML/CSS/JS)
    css/, js/         Estilos y logica del cliente
    index.html         Pantalla de login
    dashboard.html     Panel de incidencias
    serve.js           Servidor estatico simple para el frontend
  docs/               Diagrama de arquitectura
  evidencias/         Capturas de pantalla de la demo funcionando
```

## Requisitos

- Node.js 18 o superior (usa `fetch` nativo).

## Como ejecutar el proyecto

### 1. Backend (API REST)

```bash
cd backend
npm install
npm start
```

El servidor queda disponible en `http://localhost:3000`. Endpoint de verificacion:
`GET http://localhost:3000/api/health`.

Al iniciar por primera vez se crea `backend/data/db.json` con dos cuentas de prueba:

| Rol     | Correo                     | Contrasena   |
|---------|-----------------------------|--------------|
| admin   | admin@incidencias.com       | Admin123!    |
| usuario | usuario@incidencias.com     | Usuario123!  |

### 2. Frontend

En otra terminal:

```bash
cd frontend
node serve.js
```

Abrir el navegador en `http://localhost:5500`. Inicia sesion con alguna de las
cuentas de prueba anteriores.

> El backend debe estar corriendo en `http://localhost:3000` para que el frontend
> pueda autenticarse y consultar/crear incidencias (ver `frontend/js/api.js`).

## Funcionalidad demostrada

- Login con JWT y contrasenas con hash (bcrypt).
- Registro de incidencias (`POST /api/incidents`) con validacion de datos de entrada.
- Listado de incidencias segun rol: el usuario ve solo las propias, el admin ve todas
  (`GET /api/incidents`).
- Actualizacion de estado/prioridad y eliminacion de incidencias, restringido a
  administradores mediante middleware de rol (`PUT` y `DELETE /api/incidents/:id`).
- Enriquecimiento automatico de cada incidencia con su ubicacion aproximada mediante
  el consumo de la API externa `ipwho.is`.
- Manejo de respuestas de exito y error (200, 201, 400, 401, 403, 404) reflejadas en
  la interfaz.

## Evidencias

Ver carpeta `evidencias/`:

- `01_login.png` — pantalla de inicio de sesion.
- `02_dashboard_admin.png` — panel del administrador (ve todas las incidencias y
  controles de gestion).
- `03_dashboard_usuario.png` — panel del usuario normal (solo ve sus propias
  incidencias, sin controles administrativos).
- `04_error_validacion.png` — ejemplo de manejo de error de validacion (HTTP 400)
  mostrado en la interfaz.
