# PáginaPersonal — Sitio Web Personal

Trabajo II · Estándares y Computación Web · UO294914

Sitio web personal estático compuesto por cinco páginas HTML5 con CSS3. Muestra información personal, aficiones, música, videojuegos, películas y libros.

## Estructura

```
PáginaPersonal/
├── index.html        Página de inicio
├── profile.html      Perfil personal
├── audio.html        Bandas de música favoritas
├── multimedia.html   Videojuegos, películas y series
├── books.html        Biblioteca personal
├── buscar.html       Buscador interno y resultados con resaltado
├── ayuda.html        Guía de secciones, asistencia y retroalimentación
├── style.css         Hoja de estilos común (0 clases CSS)
├── translations.json Diccionario de internacionalización (ES / EN)
├── translations.js   Copia JS sincronizada para compatibilidad offline
├── i18n.js           Lógica nativa de cambio de idioma
├── search.js         Motor de búsqueda semántico sobre textos reales
└── multimedia/
    ├── audio/        Archivos de audio (.mp3)
    ├── photo/        Imágenes (.jpg, .jpeg, .png)
    └── video/        Clips de vídeo (.mp4)
```

## Despliegue

No tiene dependencias ni proceso de build. Puede abrirse directamente en el navegador o mediante un servidor HTTP local:

```bash
cd PáginaPersonal
npx serve .
# http://localhost:3000
```

## Páginas

| Página | Descripción |
|---|---|
| index.html | Bienvenida e introducción |
| profile.html | Información personal, intereses, experiencia y avales |
| audio.html | Tres bandas favoritas con audio incrustado y descripción accesible |
| multimedia.html | Videojuegos y películas/series con imágenes, vídeo y miniaturas |
| books.html | Cuatro libros de fantasía reseñados y retratos de sus autores |
| buscar.html | Resultados de búsqueda en tiempo real con fragmentos y resaltado |
| ayuda.html | Guía de navegación, explicación de secciones y canal de retroalimentación |

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica (header, main, nav, section, article, figure) |
| CSS3 | Diseño responsive, flexbox, transiciones |
