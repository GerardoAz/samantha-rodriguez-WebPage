# Samantha Rodriguez — Landing page / CV

Landing page de una sola pieza (HTML + CSS + JS, sin build ni dependencias).
Se abre haciendo doble clic en `index.html`.

## Estructura

```
portafolio-cv/
├── index.html                  ← todo el contenido de la página
├── public/                     ← LOS ARCHIVOS DE SAMANTHA
│   ├── samanthaPicture.png     ← la foto del hero
│   ├── cv.pdf                  ← el que descarga el botón del hero
│   └── LEEME.txt
├── assets/                     ← código y gráficos del sitio
│   ├── css/styles.css          ← sistema de diseño completo
│   ├── js/main.js              ← menú móvil, scroll spy, animaciones
│   └── img/
│       ├── portrait-placeholder.svg
│       └── favicon.svg
└── README.md
```

## Cambiar la foto

Deja la nueva imagen en `public/` con cualquiera de estos nombres — la página
la toma sola, sin tocar código:

```
public/samanthaPicture.png  (la actual)
public/foto.jpg → foto.jpeg → foto.png → foto.webp → placeholder
```

Recomendado: vertical, mínimo 800 × 1000 px y fondo blanco, que es lo que
permite que el retrato se funda con la tarjeta blanca del hero en vez de
verse como un rectángulo pegado.

Si el encuadre queda muy alto o muy bajo, ajusta en `assets/css/styles.css`:

```css
.hero__photo img { object-position: 50% 12%; }   /* sube o baja ese 12% */
```

## Sistema de diseño

| Token            | Valor     | Uso                                   |
|------------------|-----------|---------------------------------------|
| `--navy-900`     | `#0B2138` | Títulos, botón principal, contacto    |
| `--navy-700`     | `#1B4470` | Enlaces, nombre de empresa            |
| `--brass`        | `#A87F52` | Detalle: eyebrows, números, iconos    |
| `--bg-soft`      | `#F8F6F2` | Fondo marfil de secciones alternas    |
| `--ink`          | `#111E2C` | Texto de títulos                      |
| `--body`         | `#4C5768` | Texto de párrafo                      |

Tipografía: **Source Serif 4** para títulos (tono editorial y formal) e **Inter**
para el resto. Ambas se cargan desde Google Fonts.

Todos los colores están en `:root` al inicio de `styles.css`; cambiando esas
variables cambia la página completa.

## Secciones

1. Hero — nombre, titular, CTAs, retrato y franja de datos clave
2. About — perfil profesional + enfoque
3. Expertise — 4 tarjetas + bloque destacado (IA en People Ops)
4. Impact — 6 logros con métricas
5. Experience — línea de tiempo con los 4 puestos
6. Capabilities — áreas de práctica en chips
7. Education & certifications
8. Contact — correo, LinkedIn, teléfono, ubicación

## Detalles incluidos

- Responsive completo (escritorio, tablet, móvil con menú hamburguesa)
- Scroll spy: resalta la sección activa en el menú
- Animaciones de entrada, desactivadas si el sistema pide `prefers-reduced-motion`
- Accesibilidad: skip link, `aria-*`, foco visible, contraste alto
- Estilos de impresión: `Cmd + P` genera un CV limpio en PDF
- SEO y Open Graph listos para compartir el enlace

## Publicar

Es un sitio estático, así que sirve cualquier hosting gratuito:

- **Netlify Drop** — arrastra la carpeta a `app.netlify.com/drop`
- **GitHub Pages** — sube la carpeta a un repo y activa Pages
- **Vercel** — `vercel` desde la carpeta

## Contenido

La información viene de la combinación de los tres CVs
(HR Professional, People Business Partner y People Ops).
Para editar cualquier texto, todo está en `index.html`, con las secciones
marcadas con comentarios numerados.
