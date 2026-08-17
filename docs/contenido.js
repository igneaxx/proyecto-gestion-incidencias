// Contenido textual del reporte, usado por generate-report.js para construir el .docx

module.exports = {
  portada: {
    titulo: "Investigacion e Integracion de Componentes de Software para Aplicaciones Web",
    materia: "Desarrollo Web Integral",
    actividad: "Actividad de Investigacion y Evaluacion - Unidad III",
    integrantes: [
      "Sanchez Reyes Aylin Magdalena",
      "Chavez Urbina Luis Alfonso"
    ],
    grupo: "IDSW31",
    fecha: "15 de agosto de 2026",
    repositorio: "https://github.com/igneaxx/proyecto-gestion-incidencias"
  },

  introduccion:
    "El presente reporte documenta el desarrollo de la actividad de evaluacion de la " +
    "Unidad III de la materia Desarrollo Web Integral, centrada en la integracion de " +
    "componentes de software para aplicaciones Web. A partir del caso de estudio de un " +
    "Sistema Web de Gestion de Incidencias, se investigan los conceptos fundamentales de " +
    "codificacion segura, vulnerabilidades Web, comunicacion cifrada, APIs y Web Services, " +
    "autenticacion y autorizacion; posteriormente se disena una propuesta de arquitectura, " +
    "API REST y modelo de seguridad; y finalmente se implementa una demostracion minima " +
    "funcional que integra un backend propio, un frontend cliente y una API externa. El " +
    "objetivo es demostrar de manera aplicada la capacidad de integrar componentes de " +
    "software de forma segura para el intercambio de informacion entre aplicaciones Web.",

  // ---------------- PARTE A: INVESTIGACION ----------------
  parteA: [
    {
      pregunta:
        "1. Que significa codificacion segura y por que debe considerarse desde el " +
        "desarrollo de una aplicacion Web?",
      respuesta:
        "La codificacion segura (secure coding) es el conjunto de practicas de " +
        "programacion orientadas a prevenir que el software introduzca vulnerabilidades " +
        "explotables por un atacante, en lugar de intentar corregir esos fallos hasta " +
        "despues de que el sistema ya esta en produccion. Incluye practicas como validar " +
        "y sanitizar toda entrada del usuario, no confiar en datos que vienen del cliente, " +
        "usar consultas parametrizadas, manejar errores sin exponer informacion sensible, " +
        "aplicar el principio de menor privilegio y mantener actualizadas las dependencias. " +
        "Debe considerarse desde el inicio del desarrollo (enfoque \"security by design\") " +
        "porque corregir una vulnerabilidad detectada en produccion es mucho mas costoso, " +
        "en tiempo y en riesgo, que prevenirla en la etapa de diseno y codificacion. En el " +
        "caso del Sistema de Gestion de Incidencias, por ejemplo, si el formulario de " +
        "registro de incidencias no valida ni sanitiza el texto ingresado desde el inicio, " +
        "el sistema queda expuesto a ataques como XSS o inyeccion desde el primer dia que " +
        "se publique."
    },
    {
      pregunta:
        "2. Explica al menos cuatro vulnerabilidades Web comunes. Incluye como minimo " +
        "SQL Injection y XSS, indicando riesgo y medida de prevencion.",
      respuesta:
        "SQL Injection (inyeccion SQL): ocurre cuando la entrada del usuario se concatena " +
        "directamente en una consulta SQL, permitiendo que un atacante modifique la " +
        "consulta para leer, alterar o eliminar datos, o incluso evadir la autenticacion. " +
        "En el sistema de incidencias, si el login concatenara el correo directamente en " +
        "una consulta SQL, un atacante podria iniciar sesion sin contrasena valida. Se " +
        "previene usando consultas parametrizadas o un ORM, y nunca construyendo SQL con " +
        "concatenacion de cadenas.\n\n" +
        "Cross-Site Scripting (XSS): permite inyectar codigo JavaScript malicioso en " +
        "paginas que otros usuarios visualizan, por ejemplo dentro de la descripcion de " +
        "una incidencia, lo que puede robar cookies de sesion o tokens. Se previene " +
        "escapando/codificando la salida antes de insertarla en el HTML y aplicando una " +
        "politica de Content Security Policy (CSP).\n\n" +
        "Cross-Site Request Forgery (CSRF): un sitio malicioso induce al navegador de un " +
        "usuario autenticado a enviar una peticion no deseada (por ejemplo, cerrar una " +
        "incidencia) aprovechando que el navegador envia automaticamente las cookies de " +
        "sesion. Se previene con tokens anti-CSRF, cookies con atributo SameSite y " +
        "verificando el origen de la peticion.\n\n" +
        "Broken Access Control / IDOR (referencia directa insegura a objetos): sucede " +
        "cuando la aplicacion no verifica que el usuario tenga permiso sobre el recurso " +
        "solicitado, por ejemplo si cualquier usuario autenticado pudiera consultar la " +
        "incidencia de otro solo cambiando el id en la URL. Se previene verificando en el " +
        "backend, en cada peticion, que el recurso pertenezca al usuario o que este tenga " +
        "el rol adecuado."
    },
    {
      pregunta:
        "3. Explica la diferencia entre HTTP y HTTPS y la funcion de SSL/TLS y los " +
        "certificados digitales.",
      respuesta:
        "HTTP (Hypertext Transfer Protocol) transmite la informacion en texto plano, por " +
        "lo que cualquier persona con acceso a la red (por ejemplo en un Wi-Fi publico) " +
        "podria leer o modificar los datos en transito, incluyendo contrasenas y tokens. " +
        "HTTPS es HTTP transportado sobre una capa de cifrado TLS (Transport Layer " +
        "Security, sucesor de SSL), que cifra la comunicacion entre el navegador y el " +
        "servidor, garantiza la integridad de los datos (evita que sean alterados en " +
        "transito) y autentica la identidad del servidor mediante un certificado digital. " +
        "El certificado digital es emitido por una autoridad certificadora (CA) y contiene " +
        "la clave publica del servidor junto con datos verificados del dominio; el " +
        "navegador lo usa para confirmar que efectivamente esta hablando con el servidor " +
        "legitimo y no con un atacante interceptando la conexion (ataque " +
        "man-in-the-middle). Para el Sistema de Gestion de Incidencias, HTTPS es " +
        "indispensable porque por esa conexion viajan credenciales de login, tokens de " +
        "sesion y datos de incidencias que pueden ser sensibles."
    },
    {
      pregunta:
        "4. Define API y Web Service. Explica las diferencias principales entre SOAP y " +
        "REST.",
      respuesta:
        "Una API (Application Programming Interface) es un conjunto de reglas e " +
        "interfaces que permite que dos programas se comuniquen entre si, exponiendo " +
        "funciones o datos sin revelar la implementacion interna. Un Web Service es un " +
        "tipo especifico de API que se expone a traves de la red usando protocolos " +
        "estandar de Internet (HTTP, entre otros); es decir, todo Web Service es una API, " +
        "pero no toda API es necesariamente un Web Service (por ejemplo, una API de una " +
        "libreria local no lo es). SOAP (Simple Object Access Protocol) es un protocolo " +
        "formal que estructura los mensajes en XML con un esquema rigido (envelope, " +
        "header, body), suele requerir un contrato WSDL y ofrece caracteristicas " +
        "avanzadas de seguridad y transacciones, por lo que es comun en sistemas " +
        "bancarios o empresariales. REST (Representational State Transfer) es un estilo " +
        "arquitectonico, no un protocolo, que aprovecha directamente los metodos HTTP " +
        "(GET, POST, PUT, DELETE) sobre recursos identificados por URLs, normalmente " +
        "intercambiando JSON; es mas ligero, sin estado (stateless) y mas sencillo de " +
        "consumir desde un frontend Web o movil. Por su simplicidad y menor peso, el " +
        "Sistema de Gestion de Incidencias usa una API REST propia para comunicar el " +
        "frontend con el backend."
    },
    {
      pregunta:
        "5. Describe los metodos HTTP GET, POST, PUT/PATCH y DELETE e indica un ejemplo " +
        "de uso para cada uno.",
      respuesta:
        "GET solicita/lee un recurso sin modificarlo (es seguro e idempotente); en el " +
        "sistema se usa en GET /api/incidents para listar las incidencias del usuario. " +
        "POST crea un nuevo recurso o ejecuta una accion que cambia el estado del " +
        "servidor; se usa en POST /api/incidents para registrar una incidencia nueva o en " +
        "POST /api/auth/login para iniciar sesion. PUT/PATCH actualizan un recurso " +
        "existente: PUT normalmente reemplaza el recurso completo y PATCH aplica una " +
        "modificacion parcial; en el sistema se usa PUT /api/incidents/:id para que un " +
        "administrador cambie el estado o la prioridad de una incidencia ya creada. " +
        "DELETE elimina un recurso; se usa en DELETE /api/incidents/:id para que un " +
        "administrador cierre/elimine definitivamente una incidencia. Usar el metodo HTTP " +
        "correcto para cada operacion (en vez de hacer todo con GET o POST) hace la API " +
        "predecible, permite aprovechar cacheo e idempotencia y facilita aplicar reglas de " +
        "seguridad distintas segun la accion que se realiza."
    },
    {
      pregunta:
        "6. Explica la diferencia entre autenticacion y autorizacion.",
      respuesta:
        "La autenticacion responde a la pregunta \"quien eres?\": es el proceso de " +
        "verificar la identidad de un usuario, normalmente mediante credenciales (correo " +
        "y contrasena, token, biometria, etc.). La autorizacion responde a la pregunta " +
        "\"que puedes hacer?\": una vez que el usuario ya fue autenticado, determina a que " +
        "recursos o acciones tiene permiso de acceder segun su rol o sus permisos. En el " +
        "Sistema de Gestion de Incidencias, la autenticacion ocurre en el login, donde el " +
        "backend verifica el correo y la contrasena y entrega un token JWT; la " +
        "autorizacion ocurre despues, en cada peticion protegida, cuando el backend " +
        "revisa el rol contenido en ese token para decidir, por ejemplo, si el usuario " +
        "puede unicamente ver sus propias incidencias o si, por ser administrador, puede " +
        "tambien actualizar y cerrar cualquier incidencia. Un fallo comun es confundir " +
        "ambos conceptos: verificar solo que el usuario este autenticado (tenga un token " +
        "valido) sin revisar tambien si esta autorizado para esa accion especifica, lo que " +
        "deriva en vulnerabilidades de control de acceso."
    },
    {
      pregunta:
        "7. Investiga como funciona JWT. Describe de manera general sus tres partes y su " +
        "uso en una aplicacion Web.",
      respuesta:
        "JWT (JSON Web Token) es un estandar para representar de forma compacta y " +
        "autocontenida la identidad de un usuario y sus permisos, de manera que el " +
        "servidor no necesita guardar el estado de la sesion en memoria o base de datos " +
        "(autenticacion sin estado). Un JWT esta formado por tres partes separadas por " +
        "puntos y codificadas en Base64Url: el Header, que indica el algoritmo de firma " +
        "usado (por ejemplo HS256); el Payload, que contiene los \"claims\" o datos del " +
        "usuario (id, nombre, rol, fecha de expiracion, etc.), datos que son legibles por " +
        "cualquiera pero no deben incluir informacion secreta; y la Signature, una firma " +
        "criptografica generada con una clave secreta del servidor que permite verificar " +
        "que el token no fue alterado. En una aplicacion Web, el flujo tipico es: el " +
        "usuario inicia sesion, el backend genera y devuelve un JWT firmado; el frontend " +
        "lo guarda (en el caso de esta demo, en localStorage) y lo envia en el encabezado " +
        "Authorization: Bearer <token> en cada peticion protegida; el backend valida la " +
        "firma y la expiracion antes de procesar la solicitud, exactamente como se " +
        "implemento en el middleware requireAuth del Sistema de Gestion de Incidencias."
    },
    {
      pregunta:
        "8. Que es OAuth y en que escenario seria conveniente utilizarlo?",
      respuesta:
        "OAuth (actualmente en su version 2.0) es un protocolo de autorizacion, no de " +
        "autenticacion en si mismo, que permite que una aplicacion obtenga acceso limitado " +
        "a los recursos de un usuario en otro servicio, sin que el usuario tenga que " +
        "compartir su contrasena directamente con esa aplicacion. Funciona mediante " +
        "tokens de acceso emitidos por un servidor de autorizacion despues de que el " +
        "usuario da su consentimiento (por ejemplo, \"permitir que esta app acceda a mi " +
        "cuenta de Google\"). Seria conveniente utilizarlo en el Sistema de Gestion de " +
        "Incidencias si, por ejemplo, se quisiera ofrecer \"iniciar sesion con Google\" o " +
        "\"iniciar sesion con Microsoft\" para los usuarios de la empresa, delegando la " +
        "verificacion de identidad a un proveedor externo confiable en lugar de manejar " +
        "contrasenas propias; tambien seria util si el sistema necesitara conectarse a una " +
        "API externa que requiere autorizacion del usuario, como acceder a su calendario " +
        "para agendar una visita tecnica. Para el alcance actual del caso de estudio, con " +
        "usuarios internos de la empresa, basta con autenticacion propia mediante JWT, " +
        "pero OAuth seria la opcion natural si se integrara con identidades externas."
    },
    {
      pregunta:
        "9. Explica que son CORS, rate limiting y headers de seguridad y que riesgo " +
        "ayudan a reducir.",
      respuesta:
        "CORS (Cross-Origin Resource Sharing) es un mecanismo del navegador que restringe, " +
        "por defecto, que una pagina Web haga peticiones a un dominio distinto del que la " +
        "sirvio; el servidor debe declarar explicitamente, mediante encabezados como " +
        "Access-Control-Allow-Origin, que origenes tiene permitido consumir su API. Ayuda " +
        "a reducir el riesgo de que un sitio malicioso, cargado en el navegador de un " +
        "usuario, haga peticiones no autorizadas a la API del sistema aprovechando la " +
        "sesion activa del usuario. Rate limiting es la limitacion del numero de " +
        "peticiones que un cliente puede hacer en un periodo de tiempo; reduce el riesgo " +
        "de ataques de fuerza bruta contra el login, de abuso/scraping de la API y de " +
        "ataques de denegacion de servicio (DoS) a nivel de aplicacion. Los headers de " +
        "seguridad son encabezados HTTP de respuesta que instruyen al navegador a aplicar " +
        "protecciones adicionales, por ejemplo Content-Security-Policy (reduce el impacto " +
        "de XSS al restringir que scripts pueden ejecutarse), Strict-Transport-Security " +
        "(fuerza el uso de HTTPS) o X-Content-Type-Options: nosniff (evita que el " +
        "navegador interprete un archivo como un tipo distinto al declarado). En conjunto, " +
        "estas tres medidas reducen superficie de ataque en la capa de comunicacion entre " +
        "el frontend y la API del Sistema de Gestion de Incidencias."
    },
    {
      pregunta:
        "10. Describe que medidas deben aplicarse para validar y sanitizar informacion " +
        "recibida desde formularios o APIs.",
      respuesta:
        "La validacion consiste en verificar que los datos recibidos cumplan el formato, " +
        "tipo, longitud y reglas de negocio esperadas antes de procesarlos, por ejemplo " +
        "confirmar que el titulo de una incidencia tenga al menos 5 caracteres o que el " +
        "correo tenga formato valido, rechazando la peticion con un error 400 si no se " +
        "cumple. La sanitizacion consiste en limpiar o transformar la entrada para " +
        "eliminar o neutralizar contenido potencialmente peligroso, por ejemplo recortar " +
        "espacios, limitar la longitud maxima o escapar caracteres especiales antes de " +
        "guardarlos o mostrarlos. Las medidas recomendadas incluyen: validar siempre en el " +
        "servidor (nunca confiar unicamente en la validacion del lado del cliente, que " +
        "solo mejora la experiencia de usuario pero puede evadirse facilmente), usar " +
        "listas blancas de valores permitidos cuando sea posible (por ejemplo, que el " +
        "estado de una incidencia solo pueda ser \"abierta\", \"en_proceso\" o \"cerrada\"), " +
        "limitar la longitud de los campos de texto, usar consultas parametrizadas o un " +
        "ORM para evitar inyeccion, y codificar/escapar la salida antes de insertarla en " +
        "HTML para evitar XSS. En el backend del Sistema de Gestion de Incidencias, esto " +
        "se implemento en el middleware validateIncident y validateLogin, que revisan " +
        "tipo, longitud minima y formato antes de permitir que la peticion continue hacia " +
        "la logica de negocio."
    }
  ],

  fuentes: [
    "OWASP Foundation. OWASP Top 10:2021. https://owasp.org/Top10/",
    "OWASP Foundation. OWASP Cheat Sheet Series - Input Validation, XSS Prevention, " +
      "REST Security. https://cheatsheetseries.owasp.org/",
    "Mozilla Developer Network (MDN). HTTP - Metodos de solicitud, CORS, HTTPS. " +
      "https://developer.mozilla.org/es/docs/Web/HTTP",
    "IETF. RFC 7519 - JSON Web Token (JWT). https://datatracker.ietf.org/doc/html/rfc7519",
    "IETF. RFC 6749 - The OAuth 2.0 Authorization Framework. " +
      "https://datatracker.ietf.org/doc/html/rfc6749",
    "Documentacion oficial de Express.js. https://expressjs.com/es/",
    "Documentacion oficial de Node.js. https://nodejs.org/es/docs",
    "ipwho.is - API publica de geolocalizacion por IP. https://ipwho.is"
  ],

  // ---------------- PARTE B: ANALISIS Y DISENO ----------------
  parteB: {
    arquitecturaTexto:
      "La arquitectura propuesta (ver diagrama) sigue un modelo cliente-servidor de tres " +
      "capas mas una integracion externa. El Usuario/Navegador interactua unicamente con " +
      "el Frontend (HTML/CSS/JS), que nunca accede directamente a la base de datos ni " +
      "contiene logica de negocio sensible: solo consume la API REST propia del Backend " +
      "usando fetch y JSON, enviando el token JWT en el encabezado Authorization en cada " +
      "peticion protegida. El Backend (Node.js + Express) concentra la autenticacion " +
      "(login, generacion y verificacion de JWT), la autorizacion por rol, la validacion " +
      "de datos de entrada y la logica de negocio de las incidencias, y es el unico " +
      "componente con acceso a la Base de Datos. Adicionalmente, al crear una incidencia, " +
      "el Backend consulta una API externa de geolocalizacion por IP (ipwho.is) para " +
      "enriquecer el registro con la ubicacion aproximada de origen, sin exponer esa " +
      "llamada directamente al navegador del usuario.",

    endpoints: [
      {
        metodo: "POST",
        ruta: "/api/auth/login",
        proposito: "Autenticar a un usuario y emitir un token JWT",
        entrada: "{ email, password }",
        respuesta: "200: { token, usuario } / 401 si las credenciales son incorrectas",
        auth: "No"
      },
      {
        metodo: "GET",
        ruta: "/api/incidents",
        proposito: "Listar incidencias (todas si es admin, propias si es usuario)",
        entrada: "Ninguna (usa el token para identificar al usuario)",
        respuesta: "200: { total, incidencias: [...] }",
        auth: "Si"
      },
      {
        metodo: "GET",
        ruta: "/api/incidents/:id",
        proposito: "Consultar el detalle de una incidencia especifica",
        entrada: "Parametro de ruta id",
        respuesta: "200: incidencia / 403 si no es propia y no es admin / 404 si no existe",
        auth: "Si"
      },
      {
        metodo: "POST",
        ruta: "/api/incidents",
        proposito: "Registrar una nueva incidencia (consulta la API externa de geolocalizacion)",
        entrada: "{ titulo, descripcion, prioridad }",
        respuesta: "201: incidencia creada / 400 si los datos son invalidos",
        auth: "Si"
      },
      {
        metodo: "PUT",
        ruta: "/api/incidents/:id",
        proposito: "Actualizar estado y/o prioridad de una incidencia",
        entrada: "{ estado, prioridad }",
        respuesta: "200: incidencia actualizada / 400 estado invalido / 403 si no es admin",
        auth: "Si (solo admin)"
      },
      {
        metodo: "DELETE",
        ruta: "/api/incidents/:id",
        proposito: "Cerrar/eliminar definitivamente una incidencia",
        entrada: "Parametro de ruta id",
        respuesta: "200: mensaje de confirmacion / 404 si no existe / 403 si no es admin",
        auth: "Si (solo admin)"
      },
      {
        metodo: "GET",
        ruta: "/api/health",
        proposito: "Verificar que el servicio esta activo",
        entrada: "Ninguna",
        respuesta: "200: { status: \"ok\" }",
        auth: "No"
      }
    ],

    modeloSeguridad:
      "Inicio de sesion: el usuario envia correo y contrasena por HTTPS; el backend " +
      "busca al usuario y compara la contrasena con el hash almacenado usando bcrypt " +
      "(nunca se guardan contrasenas en texto plano). Almacenamiento seguro de " +
      "contrasenas: se usa bcrypt con salt automatico (factor de costo 10), lo que hace " +
      "inviable revertir el hash y protege incluso si la base de datos fuera filtrada. " +
      "Manejo de token/sesion: tras un login exitoso se emite un JWT firmado con una " +
      "clave secreta del servidor y expiracion de 2 horas; el frontend lo adjunta en el " +
      "encabezado Authorization: Bearer <token> en cada peticion protegida; el backend lo " +
      "valida (firma y expiracion) mediante el middleware requireAuth antes de continuar. " +
      "Roles y permisos: existen dos roles, \"usuario\" y \"admin\"; el rol viaja dentro " +
      "del payload del JWT y el middleware requireRole revisa ese rol antes de permitir " +
      "operaciones administrativas (actualizar o eliminar cualquier incidencia); un " +
      "usuario normal solo puede ver y crear sus propias incidencias.",

    proteccionDatos: [
      {
        recurso: "Contrasenas de los usuarios",
        medida: "Hash con bcrypt (salt + factor de costo), nunca se almacenan ni se " +
          "transmiten en texto plano fuera del formulario de login."
      },
      {
        recurso: "Token de sesion (JWT)",
        medida: "Firmado con clave secreta del servidor, con expiracion corta (2 horas) " +
          "para reducir la ventana de uso si es robado."
      },
      {
        recurso: "Datos personales/incidencias de otros usuarios",
        medida: "Control de acceso en el backend: se verifica el id del creador y el rol " +
          "antes de mostrar o modificar una incidencia (evita IDOR)."
      },
      {
        recurso: "Comunicacion cliente-servidor",
        medida: "Uso de HTTPS/TLS en un entorno productivo para cifrar credenciales y " +
          "datos en transito (en la demo local se documenta como requisito de despliegue)."
      },
      {
        recurso: "Operaciones administrativas (actualizar/eliminar incidencias)",
        medida: "Middleware requireRole('admin') que bloquea la accion con 403 si el " +
          "usuario autenticado no tiene el rol adecuado."
      }
    ],

    manejoErrores: [
      { codigo: "200 OK", ejemplo: "GET /api/incidents devuelve la lista de incidencias del usuario" },
      { codigo: "201 Created", ejemplo: "POST /api/incidents crea correctamente una incidencia nueva" },
      { codigo: "400 Bad Request", ejemplo: "El titulo enviado tiene menos de 5 caracteres" },
      { codigo: "401 Unauthorized", ejemplo: "El token JWT no fue enviado, es invalido o expiro" },
      { codigo: "403 Forbidden", ejemplo: "Un usuario sin rol admin intenta eliminar una incidencia" },
      { codigo: "404 Not Found", ejemplo: "Se consulta una incidencia con un id que no existe" },
      { codigo: "500 Internal Server Error", ejemplo: "Error inesperado no controlado en el servidor" }
    ],

    apiExterna:
      "Se selecciono la API publica ipwho.is (geolocalizacion por direccion IP). El " +
      "backend la consume al momento de crear una incidencia (POST /api/incidents), " +
      "obteniendo la ciudad y el pais aproximados de origen de la peticion, y guarda ese " +
      "dato en el campo \"ubicacion\" de la incidencia. Esto aporta valor real al caso de " +
      "estudio porque permite a soporte tecnico identificar rapidamente desde que sede o " +
      "region se reporta cada incidencia sin que el usuario tenga que capturarlo " +
      "manualmente, y puede usarse a futuro para detectar patrones (por ejemplo, muchas " +
      "incidencias reportadas desde la misma sucursal). La integracion es tolerante a " +
      "fallos: si la API externa no responde, la incidencia se crea de todas formas con " +
      "ubicacion nula, evitando que una dependencia externa tumbe la funcionalidad " +
      "principal del sistema.",

    riesgos: [
      {
        riesgo: "Robo de credenciales de acceso",
        vulnerabilidad: "Contrasenas debiles o transmitidas sin cifrado",
        impacto: "Acceso no autorizado a incidencias y suplantacion de identidad",
        accion: "HTTPS obligatorio, hash con bcrypt, politica de contrasenas minimas"
      },
      {
        riesgo: "Inyeccion de codigo malicioso en descripciones",
        vulnerabilidad: "Cross-Site Scripting (XSS) por falta de sanitizacion de salida",
        impacto: "Robo de sesion (token) de otros usuarios que visualicen la incidencia",
        accion: "Escapar/objetar HTML al mostrar datos, aplicar Content-Security-Policy"
      },
      {
        riesgo: "Acceso a incidencias de otros usuarios",
        vulnerabilidad: "Control de acceso roto / IDOR",
        impacto: "Fuga de informacion confidencial entre usuarios o clientes",
        accion: "Verificar propiedad del recurso y rol en cada endpoint del backend"
      },
      {
        riesgo: "Fuerza bruta contra el login",
        vulnerabilidad: "Ausencia de limite de intentos (rate limiting)",
        impacto: "Compromiso de cuentas por prueba masiva de contrasenas",
        accion: "Rate limiting en /api/auth/login y bloqueo temporal tras varios intentos"
      },
      {
        riesgo: "Elevacion de privilegios",
        vulnerabilidad: "Falta de verificacion de rol en endpoints administrativos",
        impacto: "Un usuario normal podria cerrar o alterar incidencias ajenas",
        accion: "Middleware requireRole('admin') en PUT y DELETE /api/incidents/:id"
      },
      {
        riesgo: "Interrupcion por dependencia externa",
        vulnerabilidad: "Falla o lentitud de la API externa de geolocalizacion",
        impacto: "Demora o error al crear incidencias si no se maneja el fallo",
        accion: "Llamada a la API externa envuelta en try/catch, con degradacion controlada"
      }
    ]
  },

  conclusiones:
    "El desarrollo de esta actividad permitio aplicar de manera integrada los conceptos " +
    "estudiados en la Unidad III: se identificaron y documentaron las principales " +
    "vulnerabilidades Web (SQL Injection, XSS, CSRF y control de acceso roto) y sus " +
    "medidas de prevencion; se diseno una arquitectura clara que separa frontend, backend " +
    "y base de datos, comunicados mediante una API REST propia; se definio un modelo de " +
    "seguridad basado en JWT, hashing de contrasenas con bcrypt y control de acceso por " +
    "roles; y se implemento una demostracion funcional que integra un servicio propio " +
    "(la API de incidencias) con un servicio de terceros (geolocalizacion por IP), " +
    "cumpliendo con el objetivo de comprobar la integracion de componentes de software " +
    "para el intercambio seguro de informacion entre aplicaciones Web. Como trabajo " +
    "futuro, el sistema se beneficiaria de migrar a una base de datos relacional, " +
    "agregar rate limiting real, pruebas automatizadas y despliegue bajo HTTPS con un " +
    "certificado valido."
};
