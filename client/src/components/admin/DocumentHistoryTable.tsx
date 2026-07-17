"use client";

type Row = { at: string; action: string; by: string };

export function DocumentHistoryTable({ rows }: { rows: Row[] }) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white fw-semibold">History</div>
      <div className="table-responsive">
        <table className="table table-sm table-hover mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Date / Time</th>
              <th>Action</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  No history yet
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={`${r.at}-${i}`}>
                  <td className="small text-nowrap">{r.at}</td>
                  <td>
                    <span className="badge text-bg-light border">{r.action}</span>
                  </td>
                  <td className="small">{r.by}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
