import type { GuideDefinition } from "../definitions";
import { actionGuide, puzzleGuide, racingGuide } from "./games-best-1";
import { arcadeGuide, casualGuide, freeBrowserGamesGuide, sportsGuide } from "./games-best-2";
import { fullscreenGuide, lowEndGuide, noDownloadGuide } from "./games-howto";

// Games guides (10). Written for B1; every game reference is a link plus a card, and sync verifies that each
// referenced game is published in the target database.

export const gameGuides: GuideDefinition[] = [
  freeBrowserGamesGuide,
  racingGuide,
  puzzleGuide,
  actionGuide,
  arcadeGuide,
  sportsGuide,
  casualGuide,
  lowEndGuide,
  noDownloadGuide,
  fullscreenGuide,
];
