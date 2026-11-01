// Timed beats for the demo clock. Times are milliseconds from the start.
// Append later scenes by extending cursorKeys and moving `duration`.

export const duration = 3400

// List stays up through the click. The canvas appears as the click releases.
export const sceneSwitchAt = 1880
export const clickStart = 1700
export const clickEnd = 1880

// Cursor keyframes. `nx`/`ny` are fractions of the stage.
// `selector` aims the cursor tip at the center of that element.
export const cursorKeys = [
  { t: 0, nx: 0.48, ny: 0.58 },
  { t: 800, nx: 0.48, ny: 0.58 },
  { t: 1700, selector: '[data-autoplay="create-agent"]' },
  { t: 1880, selector: '[data-autoplay="create-agent"]' },
  { t: 2700, selector: '[data-autoplay="prompt"]' },
  { t: 3400, selector: '[data-autoplay="prompt"]' },
]
