# Mi rutina de calistenia

Sitio estático para GitHub Pages: HTML, CSS, Bootstrap 5.3.3 y JavaScript sin compilación.

## Publicar

Sube `index.html`, `styles.css`, `app.mjs`, `engine.mjs` y `rutina.json` a la raíz del repositorio. En Settings > Pages selecciona Deploy from a branch, rama main y carpeta /(root). Las rutas son relativas para funcionar también en repositorios de proyecto.

## Probar localmente

Desde esta carpeta: `python3 -m http.server 8000`. Abre http://localhost:8000. No abras index.html mediante file://, porque la carga del JSON usa fetch.

Pruebas de lógica: `node --test tests/engine.test.mjs`.

## Uso

El calendario utiliza America/Mexico_City y empieza el lunes 2 de noviembre de 2026. Antes del inicio puedes consultar otra fecha con el selector. Iniciar está deshabilitado en fechas previas, posteriores a las ocho semanas y domingos. Seleccionar un día no modifica el programa.

Iniciar muestra 3, 2, 1 y comienza el ejercicio. Los ejercicios por repeticiones usan cronómetro ascendente y confirmación manual. Los cronometrados usan cuenta regresiva y cambian automáticamente. Las dosis por lado secuenciales requieren confirmar el cambio de posición. Los alternados se completan después de hacer las repeticiones de ambos lados. Los descansos se aplican entre series y entre ejercicios, excepto al terminar la sesión. El calentamiento no añade descanso.

Las caminatas son opcionales, desmarcadas al inicio. Empiezan con bloques de 60 segundos y descanso manual hasta recuperarte. Puedes terminar un ejercicio cronometrado antes: se registra como parcial y se omiten sus series restantes. Omitir ejercicio también omite las series restantes. Ambos casos esperan confirmación antes de continuar.

Pausa congela los relojes. Al ocultar la pestaña o bloquear la pantalla, la sesión se pausa para no avanzar inadvertidamente. No incluye sonido, notificaciones ni ejecución en segundo plano. No recupera una sesión interrumpida al recargar. Guarda únicamente el resumen de la última sesión en localStorage del navegador, cuando está disponible.

Bootstrap se carga desde CDN; el CSS propio mantiene el diseño usable si el CDN no responde. No requiere backend ni credenciales. No hay progresión automática de cargas, series o dificultad. La rehabilitación aparece como recordatorio y no se agrega a la secuencia.

## Datos y controles

`rutina.json` conserva rangos y objetivos por separado; el timer usa duracionSegundos.objetivo. El HTML muestra los datos como texto, sin interpretar HTML del JSON. Nunca se duplican las rutinas por semana.

`engine.mjs` contiene el calendario y la máquina de estados. `app.mjs` conecta estos datos con la interfaz. El motor usa tiempo transcurrido real; al reanudar no intenta recuperar fases durante las que la pestaña estuvo oculta.
