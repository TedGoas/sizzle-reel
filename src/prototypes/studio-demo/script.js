// Timed beats for the demo clock. Times are milliseconds from the start.
// Append later scenes by extending cursorKeys and moving `duration`.

export const duration = 20000

// List stays up through the click. The canvas appears as the click releases.
export const sceneSwitchAt = 1880

// Skill nodes appear after the editor canvas is on screen.
// Each one shimmers, then the next arrives 700ms later — same cadence as Studio.
export const skillAppearAt = [11450, 12150, 12850]
export const shimmerMs = 1200
export const enterMs = 900

// Assistant chat opens after the canvas has settled. Timings match the
// original: the prompt appears immediately, a thought starts 400ms later,
// and the reply begins 800ms after that because the nodes are already built.
export const chatOpenAt = 15000
export const chatThoughtAt = 15400
export const chatReplyAt = 16200
export const chatSlideMs = 450
export const chatTypeMs = 8
export const chatReply = "All set! I've created AI Receptionist with 3 skills to handle your request. Let me know if you'd like to adjust anything."

// Cursor keyframes. `nx`/`ny` are fractions of the stage.
// `selector` aims the cursor tip at the center of that element.
// `preview` is the suggestion-chip index whose sentence replaces the placeholder.
// A key without `preview` restores the default placeholder, including while the cursor travels.
// The hand cursor is not keyed: it shows whenever the fingertip is inside a chip or the send button.
// `press` is a data-autoplay name held down while that key is current.
// `commit` writes that chip's sentence into the input and keeps it for the rest of the timeline.
// `phase` is edit, building, or canvas. The latest phase at this time wins.
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
  { t: 9000, selector: '[data-autoplay="chip-0"]', commit: 0 },
  { t: 9680, selector: '[data-autoplay="send"]', commit: 0 },
  { t: 9860, selector: '[data-autoplay="send"]', press: 'send', commit: 0 },
  { t: 10040, selector: '[data-autoplay="send"]', phase: 'building', commit: 0 },
  { t: 10700, selector: '[data-autoplay="send"]', phase: 'building', commit: 0 },
  { t: 11100, phase: 'canvas', nx: 0.1, ny: 0.42 },
  { t: 15000, phase: 'canvas', nx: 0.1, ny: 0.42 },
  { t: 15800, phase: 'canvas', nx: 0.7, ny: 0.46 },
  { t: 20000, phase: 'canvas', nx: 0.7, ny: 0.46 },
]
