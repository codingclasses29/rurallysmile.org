"use client";

import { useMemo, useState } from "react";
import { HiPrinter, HiDownload, HiSearch, HiChevronUp, HiChevronDown } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { TableLoader } from "@/components/ui/loader/Loader";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  exportCsv?: boolean;
  printAble?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  getRowId?: (row: T, index: number) => string;
};

function getCell<T extends Record<string, unknown>>(row: T, key: string) {
  return row[key];
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  exportCsv = true,
  printAble = true,
  loading = false,
  emptyMessage = "No records found",
  className,
  getRowId,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let rows = [...data];

    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) =>
          String(getCell(row, String(col.key)) ?? "")
            .toLowerCase()
            .includes(q)
        )
      );
    }

    Object.entries(filters).forEach(([key, val]) => {
      if (!val.trim()) return;
      const v = val.toLowerCase();
      rows = rows.filter((row) =>
        String(getCell(row, key) ?? "")
          .toLowerCase()
          .includes(v)
      );
    });

    if (sortKey) {
      rows.sort((a, b) => {
        const av = getCell(a, sortKey);
        const bv = getCell(b, sortKey);
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        const cmp = String(av).localeCompare(String(bv), "en", { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, query, filters, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const downloadCsv = () => {
    const headers = columns.map((c) => c.header);
    const lines = filtered.map((row) =>
      columns
        .map((c) => {
          const val = String(getCell(row, String(c.key)) ?? "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPrint = () => window.print();

  if (loading) return <TableLoader rows={5} cols={columns.length} />;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {searchable ? (
          <div className="w-full max-w-xs">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              leftIcon={<HiSearch size={16} />}
            />
          </div>
        ) : (
          <div />
        )}
        <div className="flex gap-2">
          {exportCsv && (
            <Button size="sm" variant="outline" onClick={downloadCsv} leftIcon={<HiDownload />}>
              Export CSV
            </Button>
          )}
          {printAble && (
            <Button size="sm" variant="ghost" onClick={onPrint} leftIcon={<HiPrinter />}>
              Print
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-ui-lg border border-brand-border bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800">
            <tr>
              {columns.map((col) => {
                const key = String(col.key);
                const active = sortKey === key;
                return (
                  <th key={key} className={cn("px-4 py-3 font-semibold", col.className)}>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1",
                        col.sortable && "hover:text-brand-secondary"
                      )}
                      onClick={() => onSort(key, col.sortable)}
                    >
                      {col.header}
                      {col.sortable &&
                        (active ? (
                          sortDir === "asc" ? (
                            <HiChevronUp />
                          ) : (
                            <HiChevronDown />
                          )
                        ) : null)}
                    </button>
                    {col.filterable && (
                      <input
                        value={filters[key] || ""}
                        onChange={(e) => {
                          setFilters((f) => ({ ...f, [key]: e.target.value }));
                          setPage(1);
                        }}
                        placeholder="Filter"
                        className="mt-2 w-full rounded-ui-sm border border-brand-border px-2 py-1 text-xs normal-case tracking-normal dark:bg-slate-900"
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border dark:divide-slate-700">
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={getRowId?.(row, i) ?? i}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn("px-4 py-3 text-brand-text dark:text-slate-200", col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : String(getCell(row, String(col.key)) ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Showing {pageRows.length} of {filtered.length} records
        </p>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

/** Alias */
export const Table = DataTable;
