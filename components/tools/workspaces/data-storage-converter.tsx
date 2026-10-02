"use client";

import { useId, useState } from "react";
import { downloadSeconds, formatDuration, storageUnits } from "@/lib/tools/data-storage";
import { parseNumber } from "@/lib/tools/percentage";
import { convertUnit } from "@/lib/tools/units";
import { ToolNote } from "../ui/result-panel";
import { ToolField, ToolInput } from "../ui/tool-field";
import { UnitConverter } from "../ui/unit-converter";

function DownloadEstimate({ bytes }: { bytes: number }) {
  const id = useId();
  const [speed, setSpeed] = useState("");
  const mbps = speed.trim() === "" ? null : parseNumber(speed);
  const error = speed.trim() !== "" && (mbps === null || mbps <= 0) ? "Enter a speed above 0." : undefined;
  const seconds = mbps !== null && mbps > 0 && bytes > 0 ? downloadSeconds(bytes, mbps) : null;

  return (
    <div className="space-y-3 rounded-2xl bg-surface-2/50 p-4 ring-1 ring-white/5">
      <ToolField id={id} label="Download time at this speed (Mbps)" error={error} hint="Optional. For example 100 for a 100 megabit connection.">
        <ToolInput id={id} type="text" inputMode="decimal" autoComplete="off" value={speed} invalid={Boolean(error)} placeholder="100" onChange={(event) => setSpeed(event.target.value)} />
      </ToolField>
      <p role="status" aria-live="polite" className="text-sm">
        {seconds === null ? "Enter a speed to estimate the download time." : <>About <strong>{formatDuration(seconds)}</strong>, ignoring network overhead.</>}
      </p>
    </div>
  );
}

export function DataStorageWorkspace() {
  return (
    <UnitConverter
      units={storageUnits}
      defaultFrom="TB"
      defaultTo="GiB"
      defaultValue="1"
      convert={(value, from, to) => convertUnit(storageUnits, value, from, to)}
      details={({ value, from }) => (
        <div className="space-y-4">
          <ToolNote>
            Decimal units (KB, MB, GB, TB) count in 1,000s and are used on drive labels. Binary units (KiB, MiB, GiB, TiB) count in 1,024s. That is why a 1 TB drive shows about 931 GB where
            sizes are binary but labeled GB, as in Windows.
          </ToolNote>
          <DownloadEstimate bytes={convertUnit(storageUnits, value, from, "B")} />
        </div>
      )}
    />
  );
}
