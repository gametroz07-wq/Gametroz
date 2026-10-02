"use client";

import { useId, useState } from "react";
import { slugify, type SlugSeparator } from "@/lib/tools/slug";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToggleOption, ToolSelect } from "../ui/tool-options";

const MAX_SLUG_LENGTH = 200;

const separators = [
  { value: "-", label: "Hyphen ( - )" },
  { value: "_", label: "Underscore ( _ )" },
];

export function SlugGeneratorWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const lengthId = useId();
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState<SlugSeparator>("-");
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [lengthText, setLengthText] = useState("");

  const parsedLength = Number(lengthText);
  const lengthInvalid = lengthText.trim() !== "" && !(Number.isInteger(parsedLength) && parsedLength >= 1 && parsedLength <= MAX_SLUG_LENGTH);
  const maxLength = lengthText.trim() === "" || lengthInvalid ? null : parsedLength;

  const slug = slugify(text, { separator, maxLength, removeStopWords });
  const nothingUsable = text.trim() !== "" && slug === "";

  return (
    <div className="space-y-4">
      <ToolField
        id={inputId}
        label="Title or phrase"
        actions={<ResetButton onReset={() => setText("")} label="Clear" disabled={!text} />}
      >
        <ToolInput
          id={inputId}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="e.g. Crème Brûlée & Café: 10 Easy Recipes!"
          autoComplete="off"
        />
      </ToolField>

      <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
        <ToolSelect label="Separator" value={separator} onChange={(value) => setSeparator(value as SlugSeparator)} options={separators} className="h-11" />
        <ToolField
          id={lengthId}
          label="Max length"
          error={lengthInvalid ? `Enter a whole number from 1 to ${MAX_SLUG_LENGTH}, or leave it empty.` : undefined}
          className="w-40"
        >
          <ToolInput
            id={lengthId}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_SLUG_LENGTH}
            value={lengthText}
            onChange={(event) => setLengthText(event.target.value)}
            invalid={lengthInvalid}
            placeholder="No limit"
          />
        </ToolField>
        <div className="flex h-11 items-center">
          <ToggleOption label="Remove stop words" checked={removeStopWords} onChange={setRemoveStopWords} hint="Drop words such as the, of, and, to" />
        </div>
      </div>

      <ToolField
        id={outputId}
        label="Slug"
        actions={<CopyButton value={slug} />}
        error={nothingUsable ? "No letters or digits that can be used in a URL slug. Non-Latin characters and emoji are dropped." : undefined}
        hint={slug ? `${slug.length} characters` : undefined}
      >
        <ToolInput
          id={outputId}
          value={slug}
          readOnly
          spellCheck={false}
          invalid={nothingUsable}
          hasMessage={Boolean(slug)}
          placeholder="your-slug-appears-here"
          className="bg-surface-2/40 font-mono text-sm"
        />
      </ToolField>
    </div>
  );
}
