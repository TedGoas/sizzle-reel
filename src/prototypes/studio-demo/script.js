// Timed beats for the demo clock. Times are milliseconds from the start.
// Append later scenes by extending cursorKeys and moving `duration`.

export const duration = 9200

// List stays up through the click. The canvas appears as the click releases.
export const sceneSwitchAt = 1880

// Cursor keyframes. `nx`/`ny` are fractions of the stage.
// `selector` aims the cursor tip at the center of that element.
// `preview` is the suggestion-chip index whose sentence replaces the placeholder.
// A key without `preview` restores the default placeholder, including while the cursor travels.
// `press` is a data-autoplay name held down while that key is current.
// `commit` writes that chip's sentence into the input and keeps it for the rest of the timeline.
export const cursorKeys = [
  { t: 0, nx: 0.48, ny: 0.58 },
  { t: 800, nx: 0.48, ny: 0.58 },
  { t: 1700, selector: '[data-autoplay="create-agent"]', press: 'create-agent' },
  { t: 1880, selector: '[data-autoplay="create-agent"]' },
  { t: 2700, selector: '[data-autoplay="prompt"]' },
  { t: 3700, selector: '[data-autoplay="prompt"]' },
  { t: 4100, selector: '[data-autoplay="chip-0"]', preview: 0 },
  { t: 4900, selector: '[data-autoplay="chip-0"]' },
  { t: 5300, selector: '[data-autoplay="chip-1"]', preview: 1 },
  { t: 6100, selector: '[data-autoplay="chip-1"]' },
  { t: 6500, selector: '[data-autoplay="chip-2"]', preview: 2 },
  { t: 7300, selector: '[data-autoplay="chip-2"]' },
  { t: 7900, selector: '[data-autoplay="chip-0"]', preview: 0 },
  { t: 8200, selector: '[data-autoplay="chip-0"]', preview: 0, press: 'chip-0' },
  { t: 8380, selector: '[data-autoplay="chip-0"]', commit: 0 },
  { t: 9200, selector: '[data-autoplay="chip-0"]', commit: 0 },
]
