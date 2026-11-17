# TaskFlow

Aplicación web para la gestión sencilla de tareas personales. TaskFlow permite registrar, consultar, editar, eliminar, organizar y marcar como completadas las actividades diarias desde una interfaz clara y adaptable.

> **Proyecto académico — Ingeniería Web 2**  
> Universidad Manuela Beltrán

## Descripción

Las personas necesitan una forma simple de organizar sus actividades y llevar un seguimiento de las tareas pendientes y completadas. TaskFlow centraliza estas responsabilidades en una página web práctica, intuitiva y accesible.

El proyecto está planteado como un microproyecto web desarrollado con tecnologías frontend básicas y un backend REST sencillo.

## Objetivo

Desarrollar una página web que facilite la organización de actividades personales, permitiendo crear, consultar, editar, eliminar y marcar tareas como completadas.

## Alcance inicial del prototipo

La aplicación contiene una interfaz principal y un backend local que administra las tareas mediante una API REST. La información se guarda en el archivo `data/tasks.json`, por lo que esta versión no requiere todavía una base de datos, autenticación ni servicios externos.

## Funcionalidades previstas

- Registrar nuevas tareas.
- Consultar la lista de tareas.
- Editar la información de una tarea.
- Eliminar tareas.
- Marcar tareas como pendientes o completadas.
- Organizar tareas por prioridad y fecha límite.
- Guardar las tareas en el backend mediante un archivo JSON.
- Visualizar el estado actualizado de las actividades.
- Utilizar una interfaz adaptable a dispositivos móviles.

## Interactividad del prototipo

El prototipo inicial debe demostrar como mínimo dos elementos interactivos. Para TaskFlow se proponen los siguientes:

- Formulario o botón para agregar una tarea.
- Botón para marcar una tarea como completada.
- Botones para editar o eliminar tareas.
- Filtros o controles para visualizar tareas pendientes y completadas.

La implementación puede utilizar datos simulados durante esta primera entrega. Las funcionalidades que todavía no estén desarrolladas deben considerarse parte del alcance futuro y no de la versión publicada.

## Tecnologías

- **HTML5:** estructura de la página.
- **CSS3:** estilos, colores, distribución y diseño responsive.
- **JavaScript:** lógica e interacción con las tareas.
- **Node.js y Express:** servidor y API REST.
- **JSON:** almacenamiento local inicial del backend.
- **Visual Studio Code:** edición del código.
- **Git y GitHub:** control de versiones y almacenamiento remoto.
- **Google Chrome o Microsoft Edge:** ejecución y pruebas.

## Diseño del microproyecto

La propuesta funcional y visual del proyecto se resume en la siguiente infografía:

![Infografía del proyecto TaskFlow](https://private-us-east-1.manuscdn.com/sessionFile/TzgXawvmr3rvXJ3gClAlhu/sandbox/OPNyXKs1q2V2JZh50RiAxA-images_1794947764458_na1fn_L2hvbWUvdWJ1bnR1L1Rhc2tGbG93L2Fzc2V0cy9pbmZvZ3JhZmlhLXRhc2tmbG93.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVHpnWGF3dm1yM3J2WEozZ0NsQWxodS9zYW5kYm94L09QTnlYS3MxcTJWMkpaaDUwUmlBeEEtaW1hZ2VzXzE3OTQ5NDc3NjQ0NThfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwxUmhjMnRHYkc5M0wyRnpjMlYwY3k5cGJtWnZaM0poWm1saExYUmhjMnRtYkc5My5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTcyOTI4MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEQCIEx86Loqf3EzeyNE6vgtmjjve7c~uOl1BOskCM3IO~LnAiAZLQkpkOR8iwHLa4URVTof6c41j7HZzReNE-xfE1syYA__)

## Estructura del proyecto

```text
TaskFlow/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos de la aplicación
├── js/
│   └── app.js          # Frontend y consumo de la API
├── assets/
│   └── infografia-taskflow.png  # Material visual
├── data/
│   └── tasks.json       # Datos locales del backend
├── server.js            # Servidor Express y endpoints
├── package.json         # Configuración y dependencias
├── .env.example         # Variables de entorno de ejemplo
├── .gitignore
└── README.md
```

## Requisitos

- Node.js 18 o superior.
- npm, incluido normalmente con Node.js.
- Navegador actualizado.

Puedes comprobar las versiones con:

```bash
node --version
npm --version
```

## Instalación y ejecución local

1. Descarga o clona este repositorio.
2. Abre una terminal dentro de la carpeta del proyecto.
3. Instala las dependencias:

```bash
npm install
```

4. Inicia el servidor:

```bash
npm start
```

5. Abre en el navegador:

<http://localhost:3000>

Para desarrollo, puedes usar el modo de reinicio automático:

```bash
npm run dev
```

No abras el archivo `index.html` directamente con `file://`, porque el frontend necesita comunicarse con la API del backend.

## Despliegue en Render

TaskFlow no utiliza Streamlit. Streamlit está orientado a aplicaciones escritas en Python; este proyecto utiliza Node.js y Express. Para publicarlo, crea un **Web Service** en Render conectado al repositorio de GitHub.

En Render utiliza estos valores:

```text
Language: Node
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

El archivo `render.yaml` incluido en el proyecto contiene esta configuración como referencia. Render puede desplegar el servicio desde GitHub y volver a desplegarlo automáticamente cuando se suban nuevos commits a la rama conectada.

La versión con `data/tasks.json` sirve para una demostración académica. En un servicio gratuito, los archivos locales pueden no ser un almacenamiento permanente después de reinicios o nuevos despliegues. Para conservar datos en producción se debe migrar el backend a una base de datos o a un almacenamiento persistente.

## API REST

La API está disponible bajo la ruta `/api/tasks`:

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Comprueba que el servidor funciona |
| GET | `/api/tasks` | Lista todas las tareas |
| POST | `/api/tasks` | Crea una tarea |
| PUT | `/api/tasks/:id` | Edita o marca una tarea |
| DELETE | `/api/tasks/:id` | Elimina una tarea |

Ejemplo para crear una tarea desde la terminal:

```bash
curl -X POST http://localhost:3000/api/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Estudiar JavaScript","description":"Repasar APIs REST","priority":"alta","date":"2026-12-01"}'
```

Puedes comprobar la lista con:

```bash
curl http://localhost:3000/api/tasks
```

## Verificación

Antes de publicar una actualización, comprueba lo siguiente:

- La página se abre correctamente en un navegador actualizado.
- Los botones, formularios y enlaces responden al hacer clic.
- El diseño se visualiza correctamente en computador, tableta y móvil.
- No aparecen errores básicos en la consola del navegador.
- Las tareas se guardan en `data/tasks.json` y permanecen después de reiniciar el servidor.
- La API responde correctamente en `/api/health`.
- Cada avance importante queda registrado en un commit de Git.

## Flujo de uso

1. El usuario abre la página web.
2. Registra una tarea con título, descripción, prioridad y fecha límite.
3. El frontend envía la información al backend mediante la API REST.
4. El backend guarda las tareas en `data/tasks.json`.
5. La lista muestra las tareas pendientes y completadas.
6. El usuario puede editar, eliminar o marcar una tarea como completada.

## Validaciones recomendadas

- El título de la tarea no debe estar vacío.
- La fecha límite debe tener un formato válido.
- Las acciones de editar y eliminar deben ser claramente identificables.
- La aplicación debe mostrar un mensaje cuando no existan tareas.
- La información debe conservarse al recargar la página mientras exista el archivo `data/tasks.json`.

## Alcance y limitaciones

La primera versión utiliza un archivo JSON como almacenamiento local. Es adecuado para el prototipo académico, pero no está pensado para múltiples usuarios ni para un despliegue con alta concurrencia. Para producción se recomienda migrar a una base de datos como PostgreSQL o MongoDB y agregar autenticación.

Como posibles mejoras futuras se consideran:

- Autenticación de usuarios.
- Base de datos en la nube.
- Sincronización entre dispositivos.
- Filtros avanzados y búsqueda.
- Notificaciones para fechas límite.
- Modo oscuro.

## Historial de avances

El historial de commits debe evidenciar la evolución del proyecto. Se recomienda utilizar mensajes descriptivos, por ejemplo:

```text
Inicializar estructura del proyecto
Crear estructura HTML del prototipo
Agregar estilos responsive de TaskFlow
Implementar interacciones de tareas
Actualizar documentación del README
```

Puedes consultar el historial con:

```bash
git log --oneline --decorate --graph
```

## Estado del proyecto

Prototipo inicial en desarrollo académico.

## Integrantes

- Nombre completo: `Pendiente de completar`
- Nombre completo: `Pendiente de completar`

## Autoría

Proyecto desarrollado para la asignatura **Ingeniería Web 2** de la Universidad Manuela Beltrán.

## Licencia

Este proyecto fue creado con fines académicos. Si se requiere una licencia específica, puede agregarse posteriormente, por ejemplo, MIT.
