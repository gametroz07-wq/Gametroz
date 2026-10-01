import type { ValidationContext, ValidationResult } from "../types";
import { validateNormalizedGame } from "../validation";
import { GAMEMONETIZE } from "./config";
import { normalizeGameMonetizeGame } from "./mapper";
import type { GameMonetizeGame } from "./types";

export function validateGameMonetizeGame(game: GameMonetizeGame, context?: ValidationContext): ValidationResult {
  return validateNormalizedGame(normalizeGameMonetizeGame(game), GAMEMONETIZE, context);
}
