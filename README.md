# Mojito

Landing de cuatro sabores basada en las referencias proporcionadas. Next.js App Router, React, Tailwind CSS y TypeScript. Gestión de paquetes exclusivamente con pnpm.

## Desarrollo

```sh
pnpm install
pnpm dev
```

Abre http://localhost:3000.

## Verificación

```sh
pnpm typecheck
pnpm build
pnpm exec playwright test
```

Las pruebas requieren la aplicación en el puerto 3000 y Microsoft Edge instalado. Revisan carrusel, teclado, búsqueda, favoritos persistentes, gesto táctil, movimiento reducido y tamaños de 320 a 1672 px.

## Imágenes

Los cuatro fondos se prepararon con WaveSpeed AI (`google/nano-banana/edit`) a partir de las referencias. Los textos, búsqueda, navegación y diálogos son elementos HTML interactivos. Los archivos WebP están incluidos; la web no necesita API keys ni llama a WaveSpeed durante su ejecución.

Para regenerarlos, define `WAVESPEED_API_KEY` en el entorno y ajusta las rutas de las referencias en `scripts/generate-assets.mjs`:

```sh
pnpm assets
pnpm exec node scripts/optimize-assets.mjs
```

Cada regeneración usa la API de WaveSpeed y puede consumir saldo. Nunca expongas la clave con el prefijo `NEXT_PUBLIC_`.

## Diseño e interacciones

- Se conserva la dirección visual de las referencias: cuatro colores, imagen central, notas manuscritas y base blanca.
- Carrusel circular con flechas, teclado, selección directa y gesto horizontal.
- Búsqueda por nombres en inglés y español, incluyendo estado sin resultados.
- Favoritos locales mediante `localStorage`; no requiere una cuenta.
- Diálogos nativos con control de foco y cierre mediante Escape.
- Movimiento reducido según preferencias del sistema.
- La página mantiene el estilo claro de las referencias.

### Frutas por sabor

Naranja, sandía y lima tienen seis recortes WebP transparentes cada una en `public/images/fruits/`. Se generaron con WaveSpeed (Seedream 5.0 Pro Edit) usando las tres referencias y se recortaron con su modelo `image-background-remover`. Los originales, prompts y resultados están en `artifacts/fruits/`.

Para ajustar cada pieza, edita `src/components/flavor/fruit-pieces.ts`: `x`, `y` y `width` son porcentajes; `rotation` son grados. Blackberry sigue usando sus valores existentes en `blackberry-pieces.ts`. `FlavorDecorations` mantiene los trazos blancos y funde las frutas al cambiar de sabor.

Para regenerar, ejecuta `./scripts/generate-fruit-assets.ps1 -Flavor orange` (también `watermelon` y `lime`) y después `node scripts/prepare-fruit-assets.mjs`. La generación requiere la credencial de WaveSpeed en el entorno y consume saldo; la página solo usa los archivos locales.

### Tiempos y trayectorias

React coordina una secuencia de 2400 ms con animaciones CSS, sin dependencias de animación. El vaso sale cayendo y girando, el siguiente entra desde arriba, el fondo se revela de izquierda a derecha y los textos se desplazan hacia arriba. La mano permanece fija en sus dos capas. Si se cambia de selección durante la transición, se conserva la última petición para ejecutarla al terminar. Con movimiento reducido, el cambio es inmediato.

Los parámetros del vaso están agrupados en `src/components/flavor/cup-motion.ts`: `exitMs`, `enterMs` y `enterDelayMs` controlan los tiempos; `pivot` es el punto de giro; `slip`, `release`, `fall` y `exit` definen las fases de salida; `enter` define la posición inicial del siguiente vaso. Los valores x/y son porcentajes del tamaño del vaso y rotate son grados (positivo = horario). La duración total se calcula automáticamente. Los tiempos del texto están en `src/app/globals.css`. La animación usa un contenedor interior para conservar las posiciones y rotaciones configuradas de las imágenes.

No se ha añadido checkout, autenticación ni un backend comercial.

