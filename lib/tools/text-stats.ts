// Pure text statistics for the Word Counter. No DOM access so it can be unit-tested.

export const READING_WORDS_PER_MINUTE = 230;
export const SPEAKING_WORDS_PER_MINUTE = 130;

export type TextStats = {
  words: number;
  /** Unicode code points, so an emoji counts once. */
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingSeconds: number;
  speakingSeconds: number;
};

const secondsFor = (words: number, wordsPerMinute: number) => Math.round((words / wordsPerMinute) * 60);

export function countText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  return {
    words,
    characters: Array.from(text).length,
    charactersNoSpaces: Array.from(text.replace(/\s/g, "")).length,
    // A sentence ends with . ! or ? followed by whitespace or the end, so "3.14" stays whole.
    sentences: trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length : 0,
    paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter((part) => part.trim()).length : 0,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    readingSeconds: secondsFor(words, READING_WORDS_PER_MINUTE),
    speakingSeconds: secondsFor(words, SPEAKING_WORDS_PER_MINUTE),
  };
}

/** "42 sec", "3 min" or "1 h 2 min". */
export function formatDuration(totalSeconds: number) {
  if (totalSeconds < 60) return `${totalSeconds} sec`;
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}
