"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  entropyBits,
  generatePasswords,
  MAX_LENGTH,
  MAX_PASSWORDS,
  MIN_LENGTH,
  poolSize,
  strengthLabel,
  type PasswordOptions,
  type Strength,
} from "@/lib/tools/password";
import { cn } from "@/lib/utils";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToggleOption } from "../ui/tool-options";

const barClass: Record<Strength, string> = {
  Weak: "bg-red-500",
  Fair: "bg-amber-500",
  Strong: "bg-emerald-500",
  "Very strong": "bg-emerald-600",
};

export function PasswordWorkspace() {
  const lengthId = useId();
  const rangeId = useId();
  const countId = useId();
  const [lengthText, setLengthText] = useState("16");
  const [countText, setCountText] = useState("1");
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [error, setError] = useState<string>();

  const options: PasswordOptions = { length: Number(lengthText), upper, lower, digits, symbols, excludeAmbiguous };
  const lengthValid = Number.isInteger(options.length) && options.length >= MIN_LENGTH && options.length <= MAX_LENGTH;
  const noSets = !upper && !lower && !digits && !symbols;
  const bits = lengthValid ? entropyBits(options) : 0;
  const strength = strengthLabel(bits);

  function generate() {
    const result = generatePasswords(options, Number(countText));
    if (result.ok) {
      setPasswords(result.passwords);
      setError(undefined);
    } else {
      setPasswords([]);
      setError(result.error);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <ToolField
          id={lengthId}
          label={`Length (${MIN_LENGTH} to ${MAX_LENGTH})`}
          error={!lengthValid ? `Enter a whole number from ${MIN_LENGTH} to ${MAX_LENGTH}.` : undefined}
        >
          <div className="flex items-center gap-3">
            <input
              id={rangeId}
              type="range"
              aria-label="Password length slider"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              value={lengthValid ? options.length : 16}
              onChange={(event) => setLengthText(event.target.value)}
              className="h-11 min-w-0 flex-1 accent-brand-strong"
            />
            <ToolInput
              id={lengthId}
              type="number"
              inputMode="numeric"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              value={lengthText}
              onChange={(event) => setLengthText(event.target.value)}
              invalid={!lengthValid}
              className="w-24"
            />
          </div>
        </ToolField>
        <ToolField id={countId} label={`How many (1 to ${MAX_PASSWORDS})`} className="w-full sm:w-36">
          <ToolInput
            id={countId}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_PASSWORDS}
            value={countText}
            onChange={(event) => setCountText(event.target.value)}
          />
        </ToolField>
      </div>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="type-small mb-1.5 font-medium">Include</legend>
        <ToggleOption label="Uppercase (A-Z)" checked={upper} onChange={setUpper} />
        <ToggleOption label="Lowercase (a-z)" checked={lower} onChange={setLower} />
        <ToggleOption label="Digits (0-9)" checked={digits} onChange={setDigits} />
        <ToggleOption label="Symbols (!@#$...)" checked={symbols} onChange={setSymbols} />
        <ToggleOption
          label="Exclude look-alikes"
          checked={excludeAmbiguous}
          onChange={setExcludeAmbiguous}
          hint="Skip I, l, 1, O, 0 and o"
        />
      </fieldset>
      {noSets && (
        <p role="alert" className="text-sm text-destructive">
          Select at least one character type.
        </p>
      )}

      <div className="space-y-1.5" role="status" aria-live="polite">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{noSets || !lengthValid ? "Strength" : strength}</span>
          <span className="type-muted">
            {noSets || !lengthValid ? "" : `About ${Math.round(bits)} bits of entropy, ${poolSize(options)} possible characters`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <div
            className={cn("h-full rounded-full transition-[width]", noSets || !lengthValid ? "bg-transparent" : barClass[strength])}
            style={{ width: `${Math.min(100, (bits / 128) * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="brand" size="lg" onClick={generate} disabled={noSets || !lengthValid}>
          {passwords.length > 0 ? "Generate again" : "Generate"}
        </Button>
        <ResetButton onReset={() => { setPasswords([]); setError(undefined); }} label="Clear" disabled={passwords.length === 0 && !error} />
      </div>

      <div aria-live="polite">
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {passwords.length > 0 && (
          <ul className="divide-y divide-border/60 rounded-xl border border-input bg-surface-2/40">
            {passwords.map((password, index) => (
              <li key={`${index}-${password}`} className="flex items-center justify-between gap-3 px-4 py-3">
                <code className="min-w-0 font-mono text-sm break-all select-all sm:text-base">{password}</code>
                <CopyButton value={password} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="type-muted text-xs">Passwords exist only on this page. They are not saved, logged or sent anywhere.</p>
    </div>
  );
}
