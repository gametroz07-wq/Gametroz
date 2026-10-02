"use client";

import { useId, useState } from "react";
import { decodeUrlText, encodeUrlText, parseQueryString, type UrlMode } from "@/lib/tools/url-codec";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";
import { ToggleOption, ToolSegmented, ToolSelect } from "../ui/tool-options";
import { ToolOutput } from "../ui/tool-output";

type Tab = "encode" | "decode" | "query";

const tabs: { value: Tab; label: string }[] = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
  { value: "query", label: "Query parser" },
];

const urlModes = [
  { value: "component", label: "Component (encodeURIComponent)" },
  { value: "full", label: "Full URL (encodeURI)" },
];

export function UrlCodecWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const [tab, setTab] = useState<Tab>("encode");
  const [mode, setMode] = useState<UrlMode>("component");
  const [plusAsSpace, setPlusAsSpace] = useState(false);
  const [input, setInput] = useState("");

  const text = tab === "encode" ? encodeUrlText(input, mode) : tab === "decode" ? decodeUrlText(input, { mode, plusAsSpace }) : null;
  const query = tab === "query" ? parseQueryString(input) : null;

  const output = text?.ok ? text.output : "";
  const error = (text && !text.ok ? text.error : undefined) ?? (query && !query.ok ? query.error : undefined);
  const pairs = query?.ok ? query.pairs : [];
  const pairsText = pairs.map((pair) => `${pair.key} = ${pair.value}`).join("\n");

  const label = tab === "encode" ? "Text or URL to encode" : tab === "decode" ? "Percent-encoded text to decode" : "URL or query string";
  const placeholder =
    tab === "query" ? "https://example.com/search?q=red+shoes&size=9" : tab === "encode" ? "name=Ana & Bob/2026?" : "name%3DAna%20%26%20Bob";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <ToolSegmented label="Operation" value={tab} onChange={setTab} options={tabs} />
        {tab !== "query" && (
          <ToolSelect label="Mode" value={mode} onChange={(value) => setMode(value as UrlMode)} options={urlModes} />
        )}
        {tab === "decode" && (
          <ToggleOption label="Plus as space" checked={plusAsSpace} onChange={setPlusAsSpace} hint="Read + as a space, as HTML forms write it" />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolField
          id={inputId}
          label={label}
          error={input ? error : undefined}
          actions={<ResetButton onReset={() => setInput("")} label="Clear" disabled={!input} />}
        >
          <ToolTextArea
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            invalid={Boolean(input && error)}
            spellCheck={false}
            placeholder={placeholder}
            className="h-56 font-mono text-sm"
          />
        </ToolField>

        {tab === "query" ? (
          <ToolField id={outputId} label="Parameters" actions={<CopyButton value={pairsText} />}>
            <div id={outputId} className="h-56 overflow-auto rounded-xl border border-input bg-surface-2/40">
              {pairs.length > 0 ? (
                <table className="w-full text-left font-mono text-sm">
                  <caption className="sr-only">Query string parameters</caption>
                  <thead className="sticky top-0 bg-surface-2 text-xs">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-semibold">
                        Key
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pairs.map((pair, index) => (
                      <tr key={`${pair.key}-${index}`} className="border-t border-border/60 align-top">
                        <td className="px-3 py-2 break-all">{pair.key}</td>
                        <td className="px-3 py-2 break-all">{pair.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="type-muted p-4 text-sm">{input && !error ? "No query parameters found." : "Parsed parameters appear here."}</p>
              )}
            </div>
          </ToolField>
        ) : (
          <ToolOutput id={outputId} label="Result" value={output} placeholder="The result appears here" areaClassName="h-56" />
        )}
      </div>
    </div>
  );
}
