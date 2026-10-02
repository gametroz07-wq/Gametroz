// Pure helpers that read the provider's instructions text. They only report what the text says:
// when nothing is recognized the result is empty and the page shows nothing (no guessing).

const ARROWS =
  /\barrow keys?\b|\barrows? (?:to|for) (?:move|steer|control|jump|navigate)\b|[←→↑↓]|\b(?:left|right|up|down)\s*\/\s*(?:left|right|up|down)\b/i;
const WASD_WORD = /\bwasd\b/i;
const WASD_LETTER = /\b[WASD]\b/g;
const SPACE_BAR = /\bspace ?bar\b|\bspace\s+(?:key|to)\b/i;
const SPACE_IN_CONTEXT = /(?:\b(?:press|hit|hold|use)\s+|[,/+]\s*|\b(?:or|and)\s+)space\b(?!\s+(?:ship|station|invaders?))/i;
const PRESS_LETTER = /\b(?:[Pp]ress|[Hh]it|[Hh]old)\s+(?:the\s+)?([A-Z])\b/g;
const SHIFT = /\bshift key\b|\b(?:hold|press|hit)\s+shift\b|\bshift\s+to\b/i;
const ENTER = /\benter key\b|\b(?:press|hit)\s+enter\b|\benter\s+to\b/i;
const CTRL = /\bctrl\b|\bcontrol key\b/i;
const ESC = /\besc\b|\bescape key\b/i;
const KEYBOARD = /\bkeyboard\b/i;
const MOUSE = /\bmouse\b|\bclick(?:ing|s)?\b|\bdrag(?:ging)?\b/i;
const TOUCH = /\btaps?\b|\btapping\b|\bswip(?:e|ing)\b|\btouch ?screen\b|\btouch controls?\b/i;

function keyboardKeys(text: string) {
  const keys: string[] = [];
  if (ARROWS.test(text)) keys.push("arrow keys");
  const wasdLetters = new Set(text.match(WASD_LETTER) ?? []);
  const hasWasd = WASD_WORD.test(text) || wasdLetters.size >= 2;
  if (hasWasd) keys.push("WASD");
  if (SPACE_BAR.test(text) || SPACE_IN_CONTEXT.test(text)) keys.push("Space");
  for (const match of text.matchAll(PRESS_LETTER)) {
    const letter = match[1];
    if (!(hasWasd && "WASD".includes(letter)) && !keys.includes(letter)) keys.push(letter);
  }
  if (SHIFT.test(text)) keys.push("Shift");
  if (ENTER.test(text)) keys.push("Enter");
  if (CTRL.test(text)) keys.push("Ctrl");
  if (ESC.test(text)) keys.push("Esc");
  return keys;
}

/** Input methods named in the instructions, e.g. ["Keyboard (arrow keys, Space)", "Mouse", "Touch"]. */
export function deriveControls(instructions: string | null | undefined) {
  const text = instructions ?? "";
  const labels: string[] = [];
  const keys = keyboardKeys(text);
  if (keys.length > 0) labels.push(`Keyboard (${keys.join(", ")})`);
  else if (KEYBOARD.test(text)) labels.push("Keyboard");
  if (MOUSE.test(text)) labels.push("Mouse");
  if (TOUCH.test(text)) labels.push("Touch");
  return labels;
}

/** Splits instructions into readable lines: on line breaks and at sentence ends before a capital or digit. */
export function instructionLines(instructions: string | null | undefined) {
  return (instructions ?? "")
    .split(/\r?\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z0-9])/))
    .map((line) => line.trim())
    .filter(Boolean);
}
