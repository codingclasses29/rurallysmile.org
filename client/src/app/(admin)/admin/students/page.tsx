"use client";

import { Suspense } from "react";
import AdminStudentsInner from "./StudentsClient";

export default function AdminStudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      }
    >
      <AdminStudentsInner />
    </Suspense>
  );
}
