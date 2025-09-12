"use client";

import { useEffect, useState } from "react";
import { allowModel } from "@/lib/models/allowModel";

export type UseModelsOptions = {
  fetchUrl?: string;
  filter?: (id: string) => boolean;
  fallback?: string[];
};

export function useModels(opts: UseModelsOptions = {}) {
  const {
    // When fetchUrl is omitted, we will fetch from all providers and merge
    fetchUrl,
    filter = allowModel,
    fallback = ["gpt-4o", "gpt-4o-mini"].filter((id) => allowModel(id)),
  } = opts;

  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Determine which URLs to hit: a single one if provided, otherwise all providers
        const urls = fetchUrl
          ? [fetchUrl]
          : [
              "/api/openai/models", 
              "/api/anthropic/models",
              "/api/google/models",
              "/api/mistral/models",
              "/api/huggingface/models",
              "/api/xai/models"
            ];

        const results = await Promise.allSettled(
          urls.map((u) =>
            fetch(u, { cache: "no-store", signal: ac.signal }).then((r) =>
              r.ok ? r.json() : { models: [] }
            )
          )
        );

        // Merge, dedupe, then filter
        const collected: string[] = results
          .map((r) => (r.status === "fulfilled" ? (r.value?.models ?? []) : []))
          .flat()
          .filter((v): v is string => typeof v === "string");

        const unique = Array.from(new Set(collected));
        const filtered = unique.filter((id) => filter(id));

        setModels(filtered.length ? filtered : fallback);
      } catch (e: any) {
        // Ignore abort errors triggered by unmount/refresh
        if (e?.name === "AbortError") return;
        setError(e?.message ?? "Failed to load models");
        setModels(fallback);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [fetchUrl]);

  return { models, loading, error };
}

