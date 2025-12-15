"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Terminal,
  Shield,
  Zap,
  FileSpreadsheet,
  GitCompare,
  Copy,
  Check,
  ExternalLink,
  Info,
  Table,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CONFIG_CLAUDE_CODE = `{
  "mcpServers": {
    "diffsheets": {
      "command": "npx",
      "args": ["diffsheets-mcp"]
    }
  }
}`;

export function MCPPage() {
  const t = useTranslations("mcp");
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText("npx diffsheets-mcp");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px]"
          style={{
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/25 mb-8">
            <Terminal className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-400">
              {t("badge")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
            {t("h1").split("Claude")[0]}
            <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Claude
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("subtitle")}
          </p>

          {/* Install Command */}
          <div className="max-w-md mx-auto">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {t("install.title")}
            </p>
            <div className="flex items-center gap-2 p-4 rounded-xl bg-slate-900 border border-slate-700">
              <code className="flex-1 font-mono text-green-400 text-lg">
                $ npx diffsheets-mcp
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCommand}
                className="shrink-0 hover:bg-slate-800"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-display text-sm font-semibold text-green-500 uppercase tracking-widest mb-4 block">
              {t("features.title")}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: "local", icon: Shield },
              { key: "same", icon: Zap },
              { key: "formats", icon: FileSpreadsheet },
              { key: "strategies", icon: GitCompare },
            ].map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-slate-700 transition-all duration-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                  <Icon className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="font-display text-sm font-semibold text-green-500 uppercase tracking-widest mb-4 block">
              {t("tools.title")}
            </span>
          </div>

          <div className="space-y-4">
            {[
              { key: "compare", icon: GitCompare },
              { key: "info", icon: Info },
              { key: "data", icon: Table },
            ].map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <Icon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-mono font-semibold text-green-400 mb-1">
                    {t(`tools.${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t(`tools.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section className="py-20 px-4 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="font-display text-sm font-semibold text-green-500 uppercase tracking-widest mb-4 block">
              {t("setup.title")}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Claude Code */}
            <div>
              <h3 className="font-display font-semibold text-xl mb-2">
                {t("setup.claudeCode.title")}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {t("setup.claudeCode.description")}
              </p>
              <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 font-mono text-xs text-slate-500">
                    ~/.claude/claude_desktop_config.json
                  </span>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-slate-300">{CONFIG_CLAUDE_CODE}</code>
                </pre>
              </div>
            </div>

            {/* Claude Desktop */}
            <div>
              <h3 className="font-display font-semibold text-xl mb-2">
                {t("setup.claudeDesktop.title")}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {t("setup.claudeDesktop.description")}
              </p>
              <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500">
                      {t("setup.configPath.mac")}
                    </span>
                    <code className="block font-mono text-slate-400 mt-1">
                      ~/Library/Application Support/Claude/claude_desktop_config.json
                    </code>
                  </div>
                  <div>
                    <span className="text-slate-500">
                      {t("setup.configPath.windows")}
                    </span>
                    <code className="block font-mono text-slate-400 mt-1">
                      %APPDATA%\Claude\claude_desktop_config.json
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="font-display text-sm font-semibold text-green-500 uppercase tracking-widest mb-4 block">
              {t("examples.title")}
            </span>
          </div>

          <div className="space-y-4">
            {["compare", "strategy", "info"].map((key) => (
              <div
                key={key}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-700"
              >
                <ArrowRight className="h-4 w-4 text-green-500 shrink-0" />
                <code className="font-mono text-slate-300 text-sm">
                  {t(`examples.${key}`)}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-border">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display font-bold text-3xl mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-muted-foreground mb-8">{t("cta.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-6 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all"
            >
              <a
                href="https://www.npmjs.com/package/diffsheets-mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t("cta.npm")}
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a
                href="https://github.com/LyricalString/diffsheets/tree/main/packages/mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("cta.github")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
