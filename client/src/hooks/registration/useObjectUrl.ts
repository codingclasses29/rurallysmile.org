"use client";

import { useEffect, useMemo } from "react";

/** Safe object URL for file preview with revoke on cleanup */
export function useObjectUrl(file: File | null | undefined) {
  const url = useMemo(() => {
    if (!file || !file.type.startsWith("image/")) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
}
