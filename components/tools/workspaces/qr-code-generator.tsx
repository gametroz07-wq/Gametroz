"use client";

import { Download } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { contrastWarning, validateQrInput, validateQrSize, type QrLevel } from "@/lib/tools/qr";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput, ToolTextArea } from "../ui/tool-field";
import { ToolSelect } from "../ui/tool-options";

const levels = [
  { value: "L", label: "L (about 7% recovery)" },
  { value: "M", label: "M (about 15%)" },
  { value: "Q", label: "Q (about 25%)" },
  { value: "H", label: "H (about 30%)" },
];

type Rendered = { key: string; png: string; svg: string } | { key: string; failed: true };

function download(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function QrCodeWorkspace() {
  const textId = useId();
  const sizeId = useId();
  const fgId = useId();
  const bgId = useId();
  const [text, setText] = useState("");
  const [level, setLevel] = useState<QrLevel>("M");
  const [sizeText, setSizeText] = useState("320");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [rendered, setRendered] = useState<Rendered | null>(null);

  const size = Number(sizeText);
  const sizeCheck = validateQrSize(size);
  const inputCheck = validateQrInput(text, level);
  const ready = inputCheck.ok && sizeCheck.ok;
  const key = `${text}\n${level}\n${size}\n${foreground}\n${background}`;
  const warning = contrastWarning(foreground, background);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    // The QR library is loaded on demand, so it never weighs on pages that do not use it.
    import("qrcode")
      .then(async (QRCode) => {
        const options = { errorCorrectionLevel: level, margin: 4, width: size, color: { dark: foreground, light: background } };
        const [png, svg] = await Promise.all([QRCode.toDataURL(text, options), QRCode.toString(text, { ...options, type: "svg" })]);
        if (!cancelled) setRendered({ key, png, svg });
      })
      .catch(() => {
        if (!cancelled) setRendered({ key, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [ready, key, text, level, size, foreground, background]);

  const current = ready && rendered?.key === key ? rendered : null;
  const image = current && "png" in current ? current : null;
  const failed = current && "failed" in current;

  function downloadSvg() {
    if (!image) return;
    const url = URL.createObjectURL(new Blob([image.svg], { type: "image/svg+xml" }));
    download(url, "qrcode.svg");
    URL.revokeObjectURL(url);
  }

  function reset() {
    setText("");
    setLevel("M");
    setSizeText("320");
    setForeground("#000000");
    setBackground("#ffffff");
  }

  const showTextError = text !== "" && !inputCheck.ok;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <ToolField
          id={textId}
          label="Text or URL"
          error={showTextError && !inputCheck.ok ? inputCheck.error : undefined}
          hint="Encoded in your browser. Nothing is uploaded."
          actions={<ResetButton onReset={reset} label="Reset" disabled={!text && level === "M" && sizeText === "320" && foreground === "#000000" && background === "#ffffff"} />}
        >
          <ToolTextArea
            id={textId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            invalid={showTextError}
            hasMessage
            spellCheck={false}
            placeholder="https://example.com"
            className="h-32 text-sm"
          />
        </ToolField>

        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
          <ToolSelect label="Error correction" value={level} onChange={(value) => setLevel(value as QrLevel)} options={levels} className="h-11" />
          <ToolField
            id={sizeId}
            label="Size (px)"
            error={!sizeCheck.ok ? sizeCheck.error : undefined}
            className="w-36"
          >
            <ToolInput
              id={sizeId}
              type="number"
              inputMode="numeric"
              min={128}
              max={1024}
              step={16}
              value={sizeText}
              onChange={(event) => setSizeText(event.target.value)}
              invalid={!sizeCheck.ok}
            />
          </ToolField>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <label htmlFor={fgId} className="type-small">
              Code color
            </label>
            <input
              id={fgId}
              type="color"
              value={foreground}
              onChange={(event) => setForeground(event.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border border-input bg-background p-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={bgId} className="type-small">
              Background
            </label>
            <input
              id={bgId}
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border border-input bg-background p-1"
            />
          </div>
        </div>
        {warning && (
          <p role="alert" className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
            {warning}
          </p>
        )}
      </div>

      <div className="space-y-3" aria-live="polite">
        <div className="flex min-h-72 items-center justify-center rounded-xl border border-input bg-surface-2/40 p-4">
          {image ? (
            // A data URL, so next/image would add nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.png} alt="QR code generated from your text" width={size} height={size} className="h-auto w-full max-w-xs rounded-md" />
          ) : failed ? (
            <p role="alert" className="text-sm text-destructive">
              Could not generate a code for that input. Try shorter text or a lower error correction level.
            </p>
          ) : (
            <p className="type-muted text-center text-sm">{ready ? "Generating..." : "Your QR code appears here."}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="brand" onClick={() => image && download(image.png, "qrcode.png")} disabled={!image}>
            <Download aria-hidden="true" />
            Download PNG
          </Button>
          <Button type="button" variant="outline" onClick={downloadSvg} disabled={!image}>
            <Download aria-hidden="true" />
            Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
}
