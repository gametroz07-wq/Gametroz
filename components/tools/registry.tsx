import type { ReactElement } from "react";
import type { ImplementedToolSlug } from "@/lib/tools/implemented";
import { Base64Workspace } from "./workspaces/base64-encoder-decoder";
import { UrlCodecWorkspace } from "./workspaces/url-encoder-decoder";
import { TimestampWorkspace } from "./workspaces/timestamp-converter";
import { HashWorkspace } from "./workspaces/hash-generator";
import { UuidWorkspace } from "./workspaces/uuid-generator";
import { PasswordWorkspace } from "./workspaces/password-generator";
import { RandomNumberWorkspace } from "./workspaces/random-number-generator";
import { QrCodeWorkspace } from "./workspaces/qr-code-generator";
import { CaseConverterWorkspace } from "./workspaces/case-converter";
import { CharacterCounterWorkspace } from "./workspaces/character-counter";
import { JsonFormatterWorkspace } from "./workspaces/json-formatter";
import { PercentageCalculatorWorkspace } from "./workspaces/percentage-calculator";
import { RemoveDuplicateLinesWorkspace } from "./workspaces/remove-duplicate-lines";
import { RemoveExtraSpacesWorkspace } from "./workspaces/remove-extra-spaces";
import { SlugGeneratorWorkspace } from "./workspaces/slug-generator";
import { TextSorterWorkspace } from "./workspaces/text-sorter";
import { WordCounterWorkspace } from "./workspaces/word-counter";
import { AgeWorkspace } from "./workspaces/age-calculator";
import { BmiWorkspace } from "./workspaces/bmi-calculator";
import { DataStorageWorkspace } from "./workspaces/data-storage-converter";
import { DateDifferenceWorkspace } from "./workspaces/date-difference-calculator";
import { DiscountWorkspace } from "./workspaces/discount-calculator";
import { LengthWorkspace } from "./workspaces/length-converter";
import { TemperatureWorkspace } from "./workspaces/temperature-converter";
import { TipWorkspace } from "./workspaces/tip-calculator";
import { WeightWorkspace } from "./workspaces/weight-converter";

/**
 * Maps a tool's componentKey (its slug) to the element that renders it. The type forces an entry
 * for every slug in lib/tools/implemented.ts, and a unit test forces that list to cover every tool
 * in lib/tools/definitions.ts, so a tool cannot ship without its UI.
 */
export const toolWorkspaces: Record<ImplementedToolSlug, ReactElement> = {
  "word-counter": <WordCounterWorkspace />,
  "character-counter": <CharacterCounterWorkspace />,
  "case-converter": <CaseConverterWorkspace />,
  "remove-duplicate-lines": <RemoveDuplicateLinesWorkspace />,
  "remove-extra-spaces": <RemoveExtraSpacesWorkspace />,
  "text-sorter": <TextSorterWorkspace />,
  "slug-generator": <SlugGeneratorWorkspace />,
  "json-formatter": <JsonFormatterWorkspace />,
  "base64-encoder-decoder": <Base64Workspace />,
  "url-encoder-decoder": <UrlCodecWorkspace />,
  "timestamp-converter": <TimestampWorkspace />,
  "hash-generator": <HashWorkspace />,
  "uuid-generator": <UuidWorkspace />,
  "password-generator": <PasswordWorkspace />,
  "random-number-generator": <RandomNumberWorkspace />,
  "qr-code-generator": <QrCodeWorkspace />,
  "percentage-calculator": <PercentageCalculatorWorkspace />,
  "discount-calculator": <DiscountWorkspace />,
  "age-calculator": <AgeWorkspace />,
  "date-difference-calculator": <DateDifferenceWorkspace />,
  "bmi-calculator": <BmiWorkspace />,
  "tip-calculator": <TipWorkspace />,
  "length-converter": <LengthWorkspace />,
  "weight-converter": <WeightWorkspace />,
  "temperature-converter": <TemperatureWorkspace />,
  "data-storage-converter": <DataStorageWorkspace />,
};

export function getToolWorkspace(key: string | undefined): ReactElement | undefined {
  return key && Object.hasOwn(toolWorkspaces, key) ? toolWorkspaces[key as ImplementedToolSlug] : undefined;
}
