// Configuración de la animación. No modifica la posición de reposo del vaso.
// x/y: porcentaje del ancho/alto del vaso. x negativo = izquierda.
// rotate: grados; positivo = giro horario. Tiempos en milisegundos.
export const cupMotion = {
  exitMs: 1350,
  enterMs: 1200,
  enterDelayMs: 500,
  backgroundMs: 1800,
  pivot: "70% 65%", // Punto de contacto con los dedos alrededor del que gira.
  slip: { x: -8, y: 18, rotate: 3 }, // 30%: empieza a resbalar.
  release: { x: -22, y: 55, rotate: 6}, // 55%: pierde el agarre.
  fall: { x: -55, y: 115, rotate: 9}, // 75%: ya está cayendo libre.
  exit: { x: -95, rotate: 12}, // 100%: sale por debajo de la pantalla.
  enter: { x: 18, y: -220, rotate: -20 },
};

export const FLAVOR_TRANSITION_MS = Math.max(
  1280, // Mantiene el tiempo necesario para los textos.
  cupMotion.backgroundMs,
  cupMotion.exitMs,
  cupMotion.enterDelayMs + cupMotion.enterMs,
);

const pose = (value: { x: number; y: number; rotate: number }) =>
  `translate(${value.x}%, ${value.y}%) rotate(${value.rotate}deg)`;

export const cupMotionStyles = {
  "--flavor-duration": `${FLAVOR_TRANSITION_MS}ms`,
  "--background-duration": `${cupMotion.backgroundMs}ms`,
  "--cup-exit-duration": `${cupMotion.exitMs}ms`,
  "--cup-enter-duration": `${cupMotion.enterMs}ms`,
  "--cup-enter-delay": `${cupMotion.enterDelayMs}ms`,
  "--cup-grip-pivot": cupMotion.pivot,
  "--cup-slip": pose(cupMotion.slip),
  "--cup-release": pose(cupMotion.release),
  "--cup-fall": pose(cupMotion.fall),
  "--cup-exit": `translate(${cupMotion.exit.x}%, calc(100dvh + 150%)) rotate(${cupMotion.exit.rotate}deg)`,
  "--cup-enter": pose(cupMotion.enter),
};
