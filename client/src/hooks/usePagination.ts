"use client";

import { useMemo, useState } from "react";

export function usePagination(total = 0, initialLimit = 20) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  return { page, setPage, limit, setLimit, pages };
}
